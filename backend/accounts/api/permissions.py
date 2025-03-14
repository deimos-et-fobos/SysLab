from django.contrib.auth import get_user_model
from rest_framework import permissions

from accounts.models import Laboratory, LabMember

User = get_user_model()
    
class ListCreatePermission(permissions.DjangoModelPermissions):
    def __init__(self):
        self.perms_map['GET'] = ['%(app_label)s.list_%(model_name)s']

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
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
        if not request.user.is_authenticated:
            return False
        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)
        user = request.user
        laboratory = Laboratory.active.filter(slug=request.session['laboratory'].get('slug')).first()
        lab_member = LabMember.active.filter(user=user,laboratory=laboratory).first()
        return lab_member.has_perms(perms)
    

class LabMemberPermission(permissions.BasePermission):
    def __init__(self, permissions_required):
        # Permisos necesarios se pasan al inicializar la clase
        self.permissions_required = permissions_required

    def has_permission(self, request, view):
        # Verificar si el usuario está autenticado
        if not request.user.is_authenticated:
            return False

        try:
            # Obtener el LabMember correspondiente al usuario logueado
            lab_member = LabMember.objects.get(user=request.user)
            
            # Obtener el LabUserType del usuario
            lab_user_type = lab_member.lab_user_type

            # Verificar si el LabUserType tiene al menos uno de los permisos necesarios
            user_permissions = lab_user_type.permissions.all()
            if user_permissions.filter(codename__in=self.permissions_required).count() == len(self.permissions_required):
                return True
            else:
                return False
        except LabMember.DoesNotExist:
            return False
