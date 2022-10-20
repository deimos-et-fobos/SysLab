from django.conf import settings
from django.urls import path

from .views import index, AntibiogramView, DoctorView, HealthcareView, PatientView, ProtocolView, LabTestView

app_name = 'lab-api'
urlpatterns = [
    path('', index, name='index'),
    path('antibiograms/', AntibiogramView.as_view(), name='antibiograms'),
    path('doctors/', DoctorView.as_view(), name='doctors'),
    path('healthcare/', HealthcareView.as_view(), name='healthcare'),
    path('patients/', PatientView.as_view(), name='patients'),
    path('protocols/', ProtocolView.as_view(), name='protocols'),
    path('tests/', LabTestView.as_view(), name='tests'),
]
