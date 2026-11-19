from django.contrib import admin
from .models import Loan, Fine

admin.site.register(Loan)
admin.site.register(Fine)