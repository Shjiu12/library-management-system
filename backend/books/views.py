
from rest_framework import generics,filters
from .models import Book,BookCopy,Author,Category
from .serializers import BookSerializer,BookCopySerializer,AuthorSerializer,CategorySerializer
from .permissions import IsAdminOrLibrarianOrReadOnly


class BookListCreateView(generics.ListCreateAPIView):

    queryset = Book.objects.all().order_by('id')
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrLibrarianOrReadOnly]

    filter_backends=[filters.SearchFilter]
    search_fields=[
        'title',
        'isbn',
        'category__name',
        'authors__name',
    ]

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrLibrarianOrReadOnly]
class BookCopyListCreateView(generics.ListCreateAPIView):
    queryset=BookCopy.objects.all().order_by('id')
    serializer_class=BookCopySerializer
    permission_classes=[IsAdminOrLibrarianOrReadOnly]
class BookCopyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=BookCopy.objects.all()
    serializer_class=BookCopySerializer
    permission_classes=[IsAdminOrLibrarianOrReadOnly]
class AuthorCreateListView(generics.ListCreateAPIView):
    queryset=Author.objects.all().order_by('id')
    serializer_class=AuthorSerializer
    permission_classes=[IsAdminOrLibrarianOrReadOnly]
class AuthorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    permission_classes=[IsAdminOrLibrarianOrReadOnly]
class CategoryCreateListView(generics.ListCreateAPIView):
    queryset=Category.objects.all().order_by('id')
    serializer_class=CategorySerializer
    permission_classes=[IsAdminOrLibrarianOrReadOnly]
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    permission_classes=[IsAdminOrLibrarianOrReadOnly]
