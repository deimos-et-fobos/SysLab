# SysLab

#### TUTORIAL Django + React:
https://www.youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j

#### TRADUCCIONES
add 'django.middleware.locale.LocaleMiddleware' to settings.MIDDLEWARE
django-admin makemessages -l es
django-admin compilemessages


## TO DO
- Agregar al HomePage SelectLaboratory
- Comenzar con la interfase, la API y la lógica
- defaultValues selectInputs.
- Avatar en userList
- LoginView: session(labmember: (user, laboratory), laboratory_id, permissions)
- Views: 
	* delete(self, obj): active=false
	* permission_classes. Create permissions.py. IsOwnerOrReadOnly, IsSuperUser, ListCreatePermission, RetrieveUpdateDestroyPermission.
- Usuarios. Serializer: delete_pic, superuser: readonly, labusertype
- Add permissions to frontend. RequirePerm component.
- Create FormComponents: checkbox.
- Pacientes
- Doctores
- Tests
