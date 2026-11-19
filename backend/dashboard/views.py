from rest_framework.views import APIView
from rest_framework.response import Response

from books.models import Book, BookCopy
from members.models import Members
from circulation.models import Loan, Fine
from django.db.models import Sum
from django.utils import timezone
from .permissions import IsAdminOrLibrarian


class DashboardView(APIView):

    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):

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