from django.conf import settings
from django.urls import path

from lab.models import HealthcareProvider, Patient
from lab.api.views import index, AntibiogramView, DoctorView, HealthcareView, ProtocolView, LabTestView
from lab.api.views import ListCreatePatientView, RetrieveUpdateDestroyView
from lab.api.serializers import HealthcareProviderSerializer, PatientSerializer
from rest_framework.generics import ListCreateAPIView

app_name = 'lab-api'
urlpatterns = [
    path('', index, name='index'),
    path('antibiograms/', AntibiogramView.as_view(), name='antibiograms'),
    path('doctors/', DoctorView.as_view(), name='doctors'),
    path('healthcare/', ListCreateAPIView.as_view(queryset = HealthcareProvider.active.all().order_by('-id'), serializer_class = HealthcareProviderSerializer), name='healthcare-ListCreate'),
    # path('patients/', ListCreatePatientView.as_view(), name='patient-ListCreate'),
    path('patients/', ListCreateAPIView.as_view(queryset = Patient.active.all().order_by('-id'), serializer_class = PatientSerializer), name='patient-ListCreate'),
    path('patients/<int:id>/', RetrieveUpdateDestroyView.as_view(), name='patient-RetrieveUpdateDestroy'),
    path('protocols/', ProtocolView.as_view(), name='protocols'),
    path('tests/', LabTestView.as_view(), name='tests'),
]
