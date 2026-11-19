from django.db.models import Count, Sum
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from circulation.models import Loan, Fine
from .permissions import IsAdminOrLibrarian
from django.db import models
from decimal import Decimal

class DailyBorrowingReportView(APIView):
    permission_classes = [IsAdminOrLibrarian]
    def get(self, request):
        report = (
            Loan.objects
            .values('issue_date')
            .annotate(total=Count('id'))
            .order_by('-issue_date')
        )
        return Response(report)
class MonthlyBorrowingReportView(APIView):
    permission_classes = [IsAdminOrLibrarian]
    def get(self, request):
        report = (
            Loan.objects
            .annotate(month=TruncMonth('issue_date'))
            .values('month')
            .annotate(total=Count('id'))
            .order_by('-month')
        )
        return Response(report)
class OverdueBooksReportView(APIView):
    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):
        today = timezone.localdate()
        overdue_loans = Loan.objects.filter(
            status=Loan.Status.ACTIVE,
            due_date__lt=today
        ).select_related(
            'member__user',
            'copy__book'
        )
        data = []
        for loan in overdue_loans:
            data.append({
                'loan_id': loan.id,
                'member': loan.member.user.username,
                'book': loan.copy.book.title,
                'barcode': loan.copy.barcode,
                'due_date': loan.due_date,
                'overdue_days': (today - loan.due_date).days,
            })
        return Response(data)
class FineCollectionReportView(APIView):
    permission_classes = [IsAdminOrLibrarian]
    def get(self, request):
        report = Fine.objects.aggregate(
            total_fines=Sum('amount',
                            default=Decimal('0.00')
                            ),
            paid_fines=Sum(
                'amount',
                filter=models.Q(is_paid=True),
                default=Decimal('0.00')
            ),
            unpaid_fines=Sum(
                'amount',
                filter=models.Q(is_paid=False),
                default=Decimal('0.00')
            )
        )
        return Response(report)
class MostBorrowedBooksReportView(APIView):
    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):
        report = (
            Loan.objects
            .values('copy__book__id', 'copy__book__title')
            .annotate(total_borrowed=Count('id'))
            .order_by('-total_borrowed')[:10]
        )
        return Response(report)