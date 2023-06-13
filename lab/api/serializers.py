from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from accounts.api.serializers import UserSerializer, LaboratorySerializer, LabUserTypeSerializer
from lab.models import Antibiogram, Doctor, HealthcareProvider, LabTest, LabTestGroup, LabTestResult, Patient, Protocol, Sample

User = get_user_model()


class CustomChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        if obj == '' and self.allow_blank:
            return obj
        return self._choices[obj]
    # To support inserts with the value
    def to_internal_value(self, data):
        if data == '' and self.allow_blank:
            return ''
        for key, val in self._choices.items():
            if val == data:
                return key
        self.fail('invalid_choice', input=data)
        

# class AntibiogramSerializer(serializers.ModelSerializer):
#     protocol = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Protocol.active.all(), required=False)
#     class Meta:
#         model = Antibiogram
#         fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class HealthcareProviderSerializer(serializers.ModelSerializer):
    def iexact_name():
        return [ UniqueValidator( 
                queryset=HealthcareProvider.objects.all(), 
                message = _('There is already another health provider with this name.'), 
                lookup = 'iexact',
                )]
    name = serializers.CharField( validators = iexact_name() )
    class Meta:
        model = HealthcareProvider
        fields = ('id', 'name')

# class LabTestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LabTest
#         fields = '__all__'

# class LabTestGroupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LabTestGroup
#         fields = '__all__'

# class LabTestResultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LabTestResult
#         fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    healthcare_provider = serializers.SlugRelatedField(queryset=HealthcareProvider.active.all(), slug_field='name', allow_null=True, required=False)
    gender = CustomChoiceField(choices=Patient.GENDER)
    id_type = CustomChoiceField(choices=Patient.ID_TYPE)

    class Meta:
        model = Patient
        fields = '__all__'
    
# class PatientSerializer(PatientListSerializer):
#     gender_choices = serializers.SerializerMethodField(read_only=True)
#     id_type_choices = serializers.SerializerMethodField(read_only=True)
#     healthcare_provider_choices = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Patient
#         fields = '__all__'

#     def get_gender_choices(self, instance):
#         choices = Patient.GENDER
#         return [x[1] for x in choices]
    
#     def get_id_type_choices(self, instance):
#         choices = Patient.ID_TYPE
#         return [x[1] for x in choices]
    
#     def get_healthcare_provider_choices(self, instance):
#         choices = [None] + list(HealthcareProvider.objects.values_list('name', flat=True))
#         return choices

# class ProtocolSerializer(serializers.ModelSerializer):
#     laboratory = LaboratorySerializer()
#     patient = PatientSerializer()
#     user = serializers.SlugRelatedField(read_only=True,slug_field='full_name')
#     doctor = DoctorSerializer()
#     class Meta:
#         model = Protocol
#         fields = '__all__'

# class SampleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Sample
#         fields = '__all__'
