from django.db import models

# Create your models here.
class Author(models.Model):
    name=models.CharField(max_length=120)
    biography=models.TextField(blank=True)
    def __str__(self):
        return self.name
class Category(models.Model):
    name=models.CharField(max_length=120,unique=True)

    def __str__(self):
        return self.name
class Book(models.Model):
    title=models.CharField(max_length=150)
    isbn=models.CharField(max_length=25,unique=True)
    category=models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='books'
    )
    authors=models.ManyToManyField(
        Author,
        related_name='books'
    )
    description=models.TextField(blank=True)
    published_date=models.DateField(null=True,blank=True)

    def __str__(self):
        return self.title
class BookCopy(models.Model):
    class Status(models.TextChoices):
        AVAILABLE='AVAILABLE','Availale',
        ISSUED='ISSUED','Issued',
        LOST='LOST','Lost'
        DAMAGED='DAMAGED','Damaged'
    book=models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='copies'
    )
    barcode=models.CharField(max_length=50,unique=True)
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE
    )

    def __str__(self):
        return f"{self.book.title}-{self.barcode}"