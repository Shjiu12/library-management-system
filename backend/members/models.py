from django.conf import settings
from django.db import models

# Create your models here.
class Members(models.Model):
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='member_Profile'

    )
    phone=models.CharField(max_length=15)
    address=models.TextField()
    joined_date=models.DateField(auto_now_add=True)

    def __str__(self):
        return self.user.username
    