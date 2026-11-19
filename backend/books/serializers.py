
from rest_framework import serializers
from .models import Book,BookCopy,Author,Category


class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'isbn',
            'category',
            'authors',
            'description',
            'published_date',
        ]
class BookCopySerializer(serializers.ModelSerializer):
    book_title=serializers.CharField(
        source='book.title',
        read_only=True
    )
    class Meta:
        model=BookCopy
        fields=[
            'id',
            'book',
            'book_title',
            'barcode',
            'status',
        ]
        read_only_fields=['id']
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Author
        fields=[
            'id',
            'name',
            'biography',
        ]
        read_only_fields=['id']
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=[
            'id',
            'name',
        ]
        read_only=['id']
        