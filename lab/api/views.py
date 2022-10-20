from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, permissions

from .serializers import *
from lab.models import *

# User = get_user_model()
def index(request):
    return HttpResponse("<h1>Lab API</h1>")

class AntibiogramView(generics.ListAPIView):
    queryset = Antibiogram.active.all()
    serializer_class = AntibiogramSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DoctorView(generics.ListAPIView):
    queryset = Doctor.active.all()
    serializer_class = DoctorSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class HealthcareView(generics.ListAPIView):
    queryset = HealthcareProvider.active.all()
    serializer_class = HealthcareProviderSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProtocolView(generics.ListAPIView):
    queryset = Protocol.active.all()
    serializer_class = ProtocolSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LabTestView(generics.ListAPIView):
    queryset = LabTest.active.all()
    serializer_class = LabTestSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PatientView(generics.ListAPIView):
    queryset = Patient.active.all()
    serializer_class = PatientSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
