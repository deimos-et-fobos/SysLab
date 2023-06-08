from django.db.models.functions import Lower
from django.urls import path

from lab.models import HealthcareProvider
from lab.api.views import index, ListCreateView, RetrieveUpdateDestroyView
from lab.api.serializers import HealthcareProviderSerializer

app_name = 'lab-api'
urlpatterns = [
    path('', index, name='index'),
    path('healthcare/', ListCreateView.as_view(queryset = HealthcareProvider.active.all().order_by(Lower('name')), serializer_class = HealthcareProviderSerializer), name='healthcare-ListCreate'),
    path('healthcare/<int:id>/', RetrieveUpdateDestroyView.as_view(queryset = HealthcareProvider.active.all().order_by('name'), serializer_class = HealthcareProviderSerializer), name='healthcare-RerieveUpdeteDestroy'),

    # path('antibiograms/', AntibiogramView.as_view(), name='antibiograms'),
    # path('doctors/', DoctorView.as_view(), name='doctors'),
    # path('patients/', ListCreateView.as_view(queryset = Patient.active.all().order_by('-id'), serializer_class = PatientSerializer), name='patient-ListCreate'),
    # path('patients/<int:id>/', RetrieveUpdateDestroyView.as_view(), name='patient-RetrieveUpdateDestroy'),
    # path('protocols/', ProtocolView.as_view(), name='protocols'),
    # path('tests/', LabTestView.as_view(), name='tests'),

]
