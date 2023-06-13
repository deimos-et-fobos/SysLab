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
# (DONE) defaultValues selectInputs.
# (DONE) Avatar en userList
# (DONE) LoginView: session(labmember: (user, laboratory), laboratory_id, permissions). 
- Views: 
	# (DONE) delete(self, obj): active=false.
	* permission_classes. Create permissions.py. IsOwnerOrReadOnly, IsSuperUser, 
	# (DONE) ListCreatePermission, RetrieveUpdateDestroyPermission.
# (DONE) Usuarios. Serializer: delete_pic, labusertype
# (DONE) Add permissions to frontend. Perms Context. 
# (DONE) RequirePerm component.
# (DONE) Create FormComponents: checkbox.
# (DONE) Healthcare Providers. 
# (DONE) Pacientes
# (DONE) Doctores
# (DONE) LabMembers
- Tests
