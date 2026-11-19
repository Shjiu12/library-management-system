
from django.conf import settings
from django.db import models


class Loan(models.Model):

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        RETURNED = 'RETURNED', 'Returned'
        OVERDUE = 'OVERDUE', 'Overdue'

    member = models.ForeignKey(
        'members.Members',
        on_delete=models.PROTECT,
        related_name='loans'
    )

    copy = models.ForeignKey(
        'books.BookCopy',
        on_delete=models.PROTECT,
        related_name='loans'
    )

    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='issued_loans'
    )

    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    returned_at = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    def __str__(self):
        return f"{self.member.user.username} - {self.copy.book.title}"


class Fine(models.Model):

    loan = models.OneToOneField(
        Loan,
        on_delete=models.CASCADE,
        related_name='fine'
    )

    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Fine for Loan {self.loan.id} - {self.amount}"
