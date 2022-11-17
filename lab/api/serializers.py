from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.api.serializers import UserSerializer, LaboratorySerializer, LabMemberSerializer, LabUserTypeSerializer
from lab.models import Antibiogram, Doctor, HealthcareProvider, LabTest, LabTestGroup, LabTestResult, Patient, Protocol, Sample

User = get_user_model()

class AntibiogramSerializer(serializers.ModelSerializer):
    protocol = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Protocol.active.all(), required=False)
    class Meta:
        model = Antibiogram
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class HealthcareProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareProvider
        fields = '__all__'

class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = '__all__'

class LabTestGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestGroup
        fields = '__all__'

class LabTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestResult
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    healthcare_provider = serializers.SlugRelatedField(queryset=HealthcareProvider.active.all(), slug_field='name', allow_null=True, required=False)

    class Meta:
        model = Patient
        fields = '__all__'

class ProtocolSerializer(serializers.ModelSerializer):
    laboratory = LaboratorySerializer()
    patient = PatientSerializer()
    user = serializers.SlugRelatedField(read_only=True,slug_field='full_name')
    doctor = DoctorSerializer()
    class Meta:
        model = Protocol
        fields = '__all__'

class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = '__all__'
