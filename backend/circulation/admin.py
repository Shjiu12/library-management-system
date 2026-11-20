from django.contrib import admin
from .models import Loan, Fine,BookRequest

admin.site.register(Loan)
admin.site.register(Fine)
admin.site.register(BookRequest)