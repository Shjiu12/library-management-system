
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from members.models import Members
from books.models import BookCopy
from .models import Loan, Fine
from .serializers import (
    IssueBookSerializer,
    ReturnBookSerializer,
    LoanSerializer,
    FineSerializer
)


class IssueBookView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role not in ['ADMIN', 'LIBRARIAN']:
            return Response(
                {"error": "Only librarians and admins can issue books."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = IssueBookSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        member_id = serializer.validated_data['member_id']
        copy_id = serializer.validated_data['copy_id']
        due_date = serializer.validated_data['due_date']

        if due_date < timezone.localdate():
            return Response(
                {"error": "Due date cannot be in the past."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            member = get_object_or_404(
                Members,
                id=member_id
            )

            book_copy = get_object_or_404(
                BookCopy.objects.select_for_update(),
                id=copy_id
            )

            if book_copy.status != BookCopy.Status.AVAILABLE:
                return Response(
                    {"error": "This book copy is not available."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            loan = Loan.objects.create(
                member=member,
                copy=book_copy,
                issued_by=request.user,
                due_date=due_date
            )

            book_copy.status = BookCopy.Status.ISSUED
            book_copy.save(update_fields=['status'])

        return Response(
            {
                "message": "Book issued successfully.",
                "loan": LoanSerializer(loan).data
            },
            status=status.HTTP_201_CREATED
        )


class ReturnBookView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role not in ['ADMIN', 'LIBRARIAN']:
            return Response(
                {"error": "Only librarians and admins can return books."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ReturnBookSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        loan_id = serializer.validated_data['loan_id']

        with transaction.atomic():

            loan = get_object_or_404(
                Loan.objects.select_for_update().select_related('copy'),
                id=loan_id
            )

            if loan.status != Loan.Status.ACTIVE:
                return Response(
                    {"error": "This loan is already returned or inactive."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            today = timezone.localdate()

            loan.returned_at = today
            loan.status = Loan.Status.RETURNED
            loan.save(update_fields=['returned_at', 'status'])

            book_copy = loan.copy
            book_copy.status = BookCopy.Status.AVAILABLE
            book_copy.save(update_fields=['status'])

            overdue_days = max(
                (today - loan.due_date).days,
                0
            )

            fine_amount = Decimal('0.00')

            if overdue_days > 0:

                fine_per_day = Decimal(
                    str(getattr(settings, 'LIBRARY_FINE_PER_DAY', '5.00'))
                )

                fine_amount = overdue_days * fine_per_day

                fine, created = Fine.objects.get_or_create(
                    loan=loan,
                    defaults={
                        'amount': fine_amount,
                        'is_paid': False
                    }
                )

        response_data = {
            "message": "Book returned successfully.",
            "loan": LoanSerializer(loan).data,
            "overdue_days": overdue_days,
            "fine_amount": str(fine_amount)
        }

        if overdue_days > 0:
            response_data["fine"] = FineSerializer(fine).data

        return Response(
            response_data,
            status=status.HTTP_200_OK
        )


class LoanHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role in ['ADMIN', 'LIBRARIAN']:
            loans = Loan.objects.select_related(
                'member__user',
                'copy__book',
                'issued_by'
            ).all()

        elif request.user.role == 'MEMBER':
            loans = Loan.objects.filter(
                member__user=request.user
            ).select_related(
                'member__user',
                'copy__book',
                'issued_by'
            )

        else:
            return Response(
                {"error": "You do not have permission."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LoanSerializer(loans, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FineListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role in ['ADMIN', 'LIBRARIAN']:
            fines = Fine.objects.select_related(
                'loan__member__user',
                'loan__copy__book'
            ).all()

        elif request.user.role == 'MEMBER':
            fines = Fine.objects.filter(
                loan__member__user=request.user
            ).select_related(
                'loan__member__user',
                'loan__copy__book'
            )

        else:
            return Response(
                {"error": "You do not have permission."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = FineSerializer(fines, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FinePaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, fine_id):

        if request.user.role not in ['ADMIN', 'LIBRARIAN']:
            return Response(
                {"error": "Only admins and librarians can record payments."},
                status=status.HTTP_403_FORBIDDEN
            )

        with transaction.atomic():

            fine = get_object_or_404(
                Fine.objects.select_for_update(),
                id=fine_id
            )

            if fine.is_paid:
                return Response(
                    {"error": "This fine has already been paid."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            fine.is_paid = True
            fine.paid_at = timezone.now()

            fine.save(update_fields=['is_paid', 'paid_at'])

        return Response(
            {
                "message": "Fine payment recorded successfully.",
                "fine": FineSerializer(fine).data
            },
            status=status.HTTP_200_OK
        )
