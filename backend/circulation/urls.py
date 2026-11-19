
from django.urls import path

from .views import (
    IssueBookView,
    ReturnBookView,
    LoanHistoryView,
    FineListView,
    FinePaymentView
)

urlpatterns = [
    path('issue/', IssueBookView.as_view(), name='issue-book'),
    path('return/', ReturnBookView.as_view(), name='return-book'),
    path('loans/', LoanHistoryView.as_view(), name='loan-history'),
    path('fines/', FineListView.as_view(), name='fine-list'),
    path(
        'fines/<int:fine_id>/pay/',
        FinePaymentView.as_view(),
        name='fine-payment'
    ),
]
