from django.contrib.auth.models import AbstractUser,UserManager
from django.db import models


# Create your models here.
class CustomeUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('role','ADMIN')
        return super().create_superuser(username=username, email=email, password=password, **extra_fields)
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN='ADMIN','Admin',
        LIBRARIAN='LIBRARIAN','Librarian',
        MEMBER='MEMBER','Member',
    email=models.EmailField(unique=True)
    role=models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.MEMBER
    )
    object=CustomeUserManager()
    def __str__(self):
        return f"{self.username}{(self.role)}"

