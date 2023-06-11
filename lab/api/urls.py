from django.urls import path

from lab.models import Doctor, HealthcareProvider, Patient
from lab.api.views import index, ListCreateView, RetrieveUpdateDestroyView, TestView
from lab.api.serializers import DoctorSerializer, HealthcareProviderSerializer, PatientSerializer

app_name = 'lab-api'
urlpatterns = [
    path('', index, name='index'),
    path('doctors/', ListCreateView.as_view(queryset = Doctor.active.all(), serializer_class = DoctorSerializer), name='doctor-ListCreate'),
    path('doctors/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = Doctor.active.all().order_by('-id'), serializer_class = DoctorSerializer), name='doctor-RerieveUpdeteDestroy'),
    path('healthcare/', ListCreateView.as_view(queryset = HealthcareProvider.active.all(), serializer_class = HealthcareProviderSerializer), name='healthcare-ListCreate'),
    path('healthcare/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = HealthcareProvider.active.all().order_by('name'), serializer_class = HealthcareProviderSerializer), name='healthcare-RerieveUpdeteDestroy'),
    path('patients/', ListCreateView.as_view(queryset = Patient.active.all().order_by('-id'), serializer_class = PatientSerializer), name='patient-ListCreate'),
    path('patients/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = Patient.active.all().order_by('-id'), serializer_class = PatientSerializer), name='patient-RetrieveUpdateDestroy'),
    
    
    # path('patients/<int:id>/', TestView.as_view(), name='tests'),


    # path('antibiograms/', AntibiogramView.as_view(), name='antibiograms'),
    # path('doctors/', DoctorView.as_view(), name='doctors'),
    # path('protocols/', ProtocolView.as_view(), name='protocols'),
    # path('tests/', LabTestView.as_view(), name='tests'),

]
