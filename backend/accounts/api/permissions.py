from django.contrib.auth import get_user_model
from rest_framework import permissions

User = get_user_model()

REQ_PERMS = {
    "doctor": {
        "add": ["lab.add_doctor"],
        "change": ["lab.change_doctor"],
        "delete": ["lab.delete_doctor"],
        "view": ["lab.view_doctor"],
    },
    "labtest": {
        "add": ["lab.add_labtest", "lab.list_labtest", "lab.list_labtestgroup"],
        "change": ["lab.change_labtest", "lab.list_labtest", "lab.list_labtestgroup"],
        "delete": ["lab.delete_labtest","asdf"],
        "view": ["lab.view_labtest"],
    },
    "healthcareprovider": {
        "add": ["lab.add_healthcareprovider"],
        "change": ["lab.change_healthcareprovider"],
        "delete": ["lab.delete_healthcareprovider"],
        "view": ["lab.view_healthcareprovider"],
    },
    "patient": {
        "add": ["lab.add_patient", "lab.list_healthcareprovider"],
        "change": ["lab.change_patient", "lab.list_healthcareprovider"],
        "delete": ["lab.delete_patient"],
        "view": ["lab.view_patient"],
    },
    "user": {
        "add": ["accounts.add_customuser"],
        "change": ["accounts.change_customuser", "accounts.list_usertype"],
        "delete": ["accounts.delete_customuser"],
        "view": ["accounts.view_customuser"],
    },
    "usertype": {
        "add": ["accounts.add_usertype"],
        "change": ["accounts.change_usertype"],
        "delete": ["accounts.delete_usertype"],
        "view": ["accounts.view_usertype"],
    }
}

# class ListCreatePermission(permissions.DjangoModelPermissions):
#     def __init__(self):
#         self.perms_map['GET'] = ['%(app_label)s.list_%(model_name)s']

#     def has_permission(self, request, view):
#         if not request.user.is_authenticated:
#             return False
#         queryset = self._queryset(view)
#         perms = self.get_required_permissions(request.method, queryset.model)
#         return request.user.has_perms(perms)

class CreateRetrieveUpdateDestroyPermission(permissions.DjangoModelPermissions):
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        queryset = self._queryset(view)
        perms = self.get_required_permissions(request.method, queryset.model)
        return request.user.has_perms(perms)
    

# class LabMemberPermission(permissions.BasePermission):
#     def __init__(self, permissions_required):
#         # Permisos necesarios se pasan al inicializar la clase
#         self.permissions_required = permissions_required

#     def has_permission(self, request, view):
#         # Verificar si el usuario está autenticado
#         if not request.user.is_authenticated:
#             return False

#         try:
#             # Obtener el LabMember correspondiente al usuario logueado
#             lab_member = LabMember.objects.get(user=request.user)
            
#             # Obtener el LabUserType del usuario
#             lab_user_type = lab_member.lab_user_type

#             # Verificar si el LabUserType tiene al menos uno de los permisos necesarios
#             user_permissions = lab_user_type.permissions.all()
#             if user_permissions.filter(codename__in=self.permissions_required).count() == len(self.permissions_required):
#                 return True
#             else:
#                 return False
#         except LabMember.DoesNotExist:
#             return False
