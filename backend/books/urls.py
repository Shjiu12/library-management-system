
from django.urls import path
from .views import( BookListCreateView, 
                   BookDetailView,
                   BookCopyListCreateView,
                   BookCopyDetailView,
                   AuthorCreateListView,
                   AuthorDetailView,
                   CategoryCreateListView,
                   CategoryDetailView
)

urlpatterns = [
    path('', BookListCreateView.as_view(), name='book-list-create'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('copies/',BookCopyListCreateView.as_view(),name='book-copy-list-create'),
    path('copies/<int:pk>/',BookCopyDetailView.as_view(),name='book-copy-detail'),
    path('author/',AuthorCreateListView.as_view(),name='author-create-list'),
    path('author/<int:pk>/',AuthorDetailView.as_view(),name='Detail-view'),
    path('category/',CategoryCreateListView.as_view(),name='Category-list-create'),
    path('category/<int:pk>/',CategoryDetailView.as_view(),name='Catergory-detail'),
]
