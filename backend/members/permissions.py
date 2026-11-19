
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrLibrarianOrOwnMember(BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        return request.user.role in ['ADMIN', 'LIBRARIAN']

    def has_object_permission(self, request, view, obj):
            if request.user.role in ['ADMIN', 'LIBRARIAN']:
                return True
            if request.method in SAFE_METHODS:
                return obj.user_id == request.user.id
            if request.method in ['PUT', 'PATCH']:
                return obj.user_id == request.user.id
            return False
