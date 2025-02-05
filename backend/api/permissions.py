from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'administrator'

class IsMedicalStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'medicalStaff'

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'patient'