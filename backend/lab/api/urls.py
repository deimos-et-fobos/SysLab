from django.urls import include, path
from rest_framework import routers

from lab.models import Doctor, HealthcareProvider, LabTest, LabTestGroup, Patient
from lab.api.views import index, LabTestViewSet, ListCreateView, RetrieveUpdateDestroyView, LabTestChoices, PatientChoices
from lab.api.serializers import DoctorSerializer, HealthcareProviderSerializer, LabTestSerializer, LabTestGroupSerializer, PatientSerializer, PatientListSerializer

lab_test_router = routers.SimpleRouter()
lab_test_router.register('lab-tests', LabTestViewSet)


app_name = 'lab-api'
urlpatterns = [
    path('', index, name='index'),
    path('doctors/', ListCreateView.as_view(queryset = Doctor.active.all(), serializer_class = DoctorSerializer), name='doctor-ListCreate'),
    path('doctors/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = Doctor.active.all().order_by('-id'), serializer_class = DoctorSerializer), name='doctor-RerieveUpdeteDestroy'),
    path('healthcare/', ListCreateView.as_view(queryset = HealthcareProvider.active.all(), serializer_class = HealthcareProviderSerializer), name='healthcare-ListCreate'),
    path('healthcare/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = HealthcareProvider.active.all().order_by('name'), serializer_class = HealthcareProviderSerializer), name='healthcare-RerieveUpdeteDestroy'),
    path('lab-tests/new/', LabTestChoices.as_view(), name='lab-tests-choices'),
    path('', include(lab_test_router.urls)),
    path('lab-test-groups/', ListCreateView.as_view(queryset = LabTestGroup.active.all(), serializer_class = LabTestGroupSerializer), name='labtestgroup-ListCreate'),
    path('patients/', ListCreateView.as_view(queryset = Patient.active.all().order_by('-id'), serializer_class = PatientListSerializer), name='patient-ListCreate'),
    path('patients/new/', PatientChoices.as_view(), name='patient-choices'),
    path('patients/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = Patient.active.all().order_by('-id'), serializer_class = PatientSerializer), name='patient-RetrieveUpdateDestroy'),
    
    # path('patients/<int:id>/', TestView.as_view(), name='tests'),


    # path('antibiograms/', AntibiogramView.as_view(), name='antibiograms'),
    # path('doctors/', DoctorView.as_view(), name='doctors'),
    # path('protocols/', ProtocolView.as_view(), name='protocols'),
    # path('tests/', LabTestView.as_view(), name='tests'),

]
