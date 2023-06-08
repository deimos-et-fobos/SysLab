from django.contrib.auth import get_user_model
from rest_framework import permissions

from accounts.models import Laboratory, LabMember

User = get_user_model()
    
class ListCreatePermission(permissions.DjangoModelPermissions):
    def __init__(self):
        self.perms_map['GET'] = ['%(app_label)s.list_%(model_name)s']

    def has_permission(self, request, view):
        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)
        user = request.user
        laboratory = Laboratory.active.filter(slug=request.session['laboratory'].get('slug')).first()
        lab_member = LabMember.active.filter(user=user,laboratory=laboratory).first()
        return lab_member.has_perms(perms)

class RetrieveUpdateDestroyPermission(permissions.DjangoModelPermissions):
    def __init__(self):
        self.perms_map['GET'] = ['%(app_label)s.view_%(model_name)s']

    def has_permission(self, request, view):
        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)
        user = request.user
        laboratory = Laboratory.active.filter(slug=request.session['laboratory'].get('slug')).first()
        lab_member = LabMember.active.filter(user=user,laboratory=laboratory).first()
        return lab_member.has_perms(perms)