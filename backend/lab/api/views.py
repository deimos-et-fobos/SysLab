from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response

from accounts.api.permissions import CreateRetrieveUpdateDestroyPermission
from lab.models import LabTest, Patient
from lab.api.serializers import LabTestSerializer, LabTestListSerializer,  PatientSerializer

# User = get_user_model()
def index(request):
    return HttpResponse("<h1>Lab API</h1>")

# class AntibiogramView(generics.ListAPIView):
#     queryset = Antibiogram.active.all()
#     serializer_class = AntibiogramSerializer
#     # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# class DoctorView(generics.ListAPIView):
#     queryset = Doctor.active.all()
#     serializer_class = DoctorSerializer
#     # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# class HealthcareView(generics.ListAPIView):
#     queryset = HealthcareProvider.active.all()
#     serializer_class = HealthcareProviderSerializer
#     # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# class ProtocolView(generics.ListAPIView):
#     queryset = Protocol.active.all()
#     serializer_class = ProtocolSerializer
#     # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# class LabTestView(generics.ListAPIView):
#     queryset = LabTest.active.all()
#     serializer_class = LabTestSerializer
#     # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.active.all().order_by('-id')
    serializer_class = LabTestSerializer

    # permission_classes = [ListCreatePermission]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'create':
            permission_classes = [CreateRetrieveUpdateDestroyPermission]
        else:
            permission_classes = [CreateRetrieveUpdateDestroyPermission]
        return [permission() for permission in permission_classes]

    def list(self, request):
        self.serializer_class = LabTestListSerializer
        return super().list(request)
    
    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.is_active = False
        obj.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def create(self, request):
    #     self.serializer_class = LabTestSerializer
    #     return super().create(request)

    # def retrieve(self, request, *args, **kwargs):
    #     return super().retrieve(request, *args, **kwargs)



    # def partial_update(self, request, pk=None):
    #     pass

    # def destroy(self, request, pk=None):
    #     pass

class ListCreateView(generics.ListCreateAPIView):
    queryset = Patient.active.all().order_by('-id')
    serializer_class = PatientSerializer
    permission_classes = [CreateRetrieveUpdateDestroyPermission]

    # def get_object(self, request, *args, **kwargs):
    #     self.check_permissions(request)
    #     self.check_object_permissions(request, obj)
    #     return super().get_object(request, *args, **kwargs)

class RetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.active.all()
    lookup_field = 'id'
    serializer_class = PatientSerializer
    permission_classes = [CreateRetrieveUpdateDestroyPermission]

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.is_active = False
        obj.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)    


class TestView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.active.all()
    lookup_field = 'id'
    serializer_class = PatientSerializer

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        data = PatientSerializer(obj).data
        del(data['id'])
        # data['gender'] = '3'
        # data['id_type'] = '1'
        # data['healthcare_provider'] = ''
        print(data)
        pat = PatientSerializer(data=data)
        pat.is_valid(raise_exception=False)
        print(pat.errors)
        print(pat)
        # pat.save()
        return super().get(request, *args, **kwargs)

    
