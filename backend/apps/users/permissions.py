from rest_framework.permissions import BasePermission


class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view):  

        return request.user.role in [
            "ADMIN",
            "DOCTOR",
        ]


class IsAuditorOrAdmin(BasePermission):
    def has_permission(self, request, view):  

        return request.user.role in [
            "ADMIN",
            "AUDITOR",
        ]


class CanCreateObservation(BasePermission):
    def has_permission(self, request, view): 

        return request.user.role in [
            "ADMIN",
            "DOCTOR",
            "NURSE",
        ]
