from django.urls import path
from .views import (
    DailyBorrowingReportView,
    MonthlyBorrowingReportView,
    OverdueBooksReportView,
    FineCollectionReportView,
    MostBorrowedBooksReportView,
)
urlpatterns = [
    path('daily/', DailyBorrowingReportView.as_view(), name='daily-report'),
    path('monthly/', MonthlyBorrowingReportView.as_view(), name='monthly-report'),
    path('overdue/', OverdueBooksReportView.as_view(), name='overdue-report'),
    path('fines/', FineCollectionReportView.as_view(), name='fine-report'),
    path('most-borrowed/', MostBorrowedBooksReportView.as_view(), name='most-borrowed-report'),
]