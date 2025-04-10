# SysLab

# Versions
 - python 3.11.2
 - nvm 0.39.3
 - node v18.15.0
 - npm 9.5.0

#### TUTORIAL Django + React:
https://www.youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j

#### TRADUCCIONES
add 'django.middleware.locale.LocaleMiddleware' to settings.MIDDLEWARE
django-admin makemessages -l es
django-admin compilemessages


## TO DO
- Comenzar con la interfase, la API y la lógica
# (DONE) defaultValues selectInputs.
# (DONE) Avatar en userList
# (DONE) LoginView: session(labmember: (user, laboratory), laboratory_id, permissions). 
- Views: 
	# (DONE) delete(self, obj): active=false.
	# (DONE) Create permissions.py.
	# (DONE) ListCreatePermission, RetrieveUpdateDestroyPermission.
	* permission_classes. IsOwnerOrReadOnly, IsSuperUser, 
# (DONE) Usuarios. Serializer: delete_pic, labusertype
# (DONE) Add permissions to frontend. Perms Context. 
# (DONE) RequirePerm component.
# (DONE) Create FormComponents: checkbox.
# (DONE) Healthcare Providers. 
# (DONE) Pacientes
# (DONE) Doctores
# (DONE) LabTests

accounts/
Usuarios, roles, autenticación.

CustomUser

UserType

labs/
Estructura del laboratorio, tests, organización.

Laboratory

LabTest → Define un análisis (por ejemplo, "Glucemia").

LabTestGroup → Conjunto de tests agrupados, por ejemplo, "Perfil Lipídico".

(Si tenés modelos como LabTestResult, también van acá.)

patients/
Gestión de pacientes.

Patient

protocols/
Protocolos médicos y su contexto.

Protocol

ProtocolType

SampleType

Doctor

HealthcareProvider

