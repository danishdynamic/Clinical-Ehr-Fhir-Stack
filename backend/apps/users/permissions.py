from rest_framework.permissions import BasePermission

class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:  
        # 1. Guard against unauthenticated requests
        if not request.user or not request.user.is_authenticated:
            return False
            
        # 2. Defensive superuser bypass using getattr to satisfy Pylance
        if getattr(request.user, "is_superuser", False):
            return True

        # 3. Fallback to standard role check
        return getattr(request.user, "role", None) in ["ADMIN", "DOCTOR"]


class IsAuditorOrAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:  
        if not request.user or not request.user.is_authenticated:
            return False
            
        if getattr(request.user, "is_superuser", False):
            return True

        return getattr(request.user, "role", None) in ["ADMIN", "AUDITOR"]


class CanCreateObservation(BasePermission):
    def has_permission(self, request, view) -> bool: 
        if not request.user or not request.user.is_authenticated:
            return False
            
        if getattr(request.user, "is_superuser", False):
            return True

        return getattr(request.user, "role", None) in ["ADMIN", "DOCTOR", "NURSE"]