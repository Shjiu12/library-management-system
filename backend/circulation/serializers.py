
from rest_framework import serializers
from .models import Loan, Fine,BookRequest
from django.utils import timezone

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
class BookRequestSerializer(serializers.ModelSerializer):
    member_name=serializers.CharField(
        source='member.user.username',
        read_only=True 
    )
    book_title=serializers.CharField(
        source='book.title',
        read_only=True
    )
    class Meta:
        model=BookRequest
        fields=[
            'id',
            'member',
            'member_name',
            'book',
            'book_title',
            'status',
            'requested_at',
            'reviewed_at'
        ]
        read_only_fields=[
            'id',
            'member',
            'member_name',
            'book_title',
            'status',
            'requested_at',
            'reviewed_at'
        ]
class ReviewBookRequestSerializer(serializers.Serializer):
    status=serializers.ChoiceField(
        choices=[
            ('APPROVED','Approved'),
            ('REJECTED','Rejected')
        ]
    )
    due_date=serializers.DateField(required=False)
    def validate(self, attrs):
        if attrs['status']=='APPROVED':
            due_date=attrs.get('due_date')
            if not due_date:
                raise serializers.ValidationError({
                    'due_date':'Due date is required when approving a request.'
                })
            if due_date <timezone.localdate():
                raise serializers.ValidationError({
                    'due_date':'Due date cannot be in the past.'
                })
        return attrs