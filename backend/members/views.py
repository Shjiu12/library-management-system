from django.shortcuts import render
from rest_framework import generics
from .models import Members
from .serializers import MemberSerializer
from .permissions import IsAdminOrLibrarianOrOwnMember
# Create your views here.
class MemberListCreateView(generics.ListCreateAPIView):
    serializer_class=MemberSerializer
    permission_classes=[IsAdminOrLibrarianOrOwnMember]
    def get_queryset(self):
        user=self.request.user
        if user.role in ['ADMIN','LIBRARIAN']:
            return Members.objects.all()
        return Members.objects.filter(user=user)
class MemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=MemberSerializer
    permission_classes=[IsAdminOrLibrarianOrOwnMember]
    def get_queryset(self):
        user=self.request.user
        if user.role in ['ADMIN','LIBRARIAN']:
            return Members.objects.all()
        return Members.objects.filter(user=user)
