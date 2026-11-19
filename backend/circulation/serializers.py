
from rest_framework import serializers
from .models import Loan, Fine


class IssueBookSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    copy_id = serializers.IntegerField()
    due_date = serializers.DateField()


class ReturnBookSerializer(serializers.Serializer):
    loan_id = serializers.IntegerField()


class LoanSerializer(serializers.ModelSerializer):

    member_name = serializers.CharField(
        source='member.user.username',
        read_only=True
    )

    book_title = serializers.CharField(
        source='copy.book.title',
        read_only=True
    )

    barcode = serializers.CharField(
        source='copy.barcode',
        read_only=True
    )

    class Meta:
        model = Loan
        fields = [
            'id',
            'member',
            'member_name',
            'copy',
            'book_title',
            'barcode',
            'issued_by',
            'issue_date',
            'due_date',
            'returned_at',
            'status',
        ]


class FineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Fine
        fields = [
            'id',
            'loan',
            'amount',
            'is_paid',
            'paid_at',
        ]
