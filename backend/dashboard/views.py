from rest_framework.views import APIView
from rest_framework.response import Response
from books.models import Book, BookCopy
from members.models import Members
from circulation.models import Loan, Fine
from django.db.models import Sum
from django.utils import timezone
from .permissions import IsAdminLibrarianOrMember
class DashboardView(APIView):

    permission_classes = [IsAdminLibrarianOrMember]
    def get(self, request):
        # MEMBER DASHBOARD
        if request.user.role == 'MEMBER':
            member = Members.objects.filter(
                user=request.user
            ).first()
            if not member:
                return Response({
                    'total_borrowed': 0,
                    'active_loans': 0,
                    'overdue_loans': 0,
                    'returned_loans': 0,
                    'total_fines': 0,
                    'unpaid_fines': 0,
                })
            loans = Loan.objects.filter(member=member)
            fines = Fine.objects.filter(
                loan__member=member
            )
            data = {
                'total_borrowed': loans.count(),

                'active_loans': loans.filter(
                    status='ACTIVE'
                ).count(),
                'overdue_loans': loans.filter(
                    status='ACTIVE',
                    due_date__lt=timezone.localdate()
                ).count(),
                'returned_loans': loans.filter(
                    status='RETURNED'
                ).count(),
                'total_fines': fines.aggregate(
                    total=Sum('amount')
                )['total'] or 0,
                'unpaid_fines': fines.filter(
                    is_paid=False
                ).aggregate(
                    total=Sum('amount')
                )['total'] or 0,
            }
            return Response(data)
        data = {
            'total_books': Book.objects.count(),
            'total_copies': BookCopy.objects.count(),
            'available_copies': BookCopy.objects.filter(
                status='AVAILABLE'
            ).count(),
            'issued_copies': BookCopy.objects.filter(
                status='ISSUED'
            ).count(),
            'total_members': Members.objects.count(),
            'active_loans': Loan.objects.filter(
                status='ACTIVE'
            ).count(),
            'overdue_loans': Loan.objects.filter(
                status='ACTIVE',
                due_date__lt=timezone.localdate()
            ).count(),
            'total_fines': Fine.objects.aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'unpaid_fines': Fine.objects.filter(
                is_paid=False
            ).aggregate(
                total=Sum('amount')
            )['total'] or 0,
        }
        return Response(data)