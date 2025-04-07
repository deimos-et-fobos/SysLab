from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from accounts.api.serializers import UserSerializer, LaboratorySerializer, UserTypeSerializer
from lab.models import Antibiogram, Doctor, HealthcareProvider, LabTest, LabTestGroup, LabTestResult, Patient, Protocol, Sample

User = get_user_model()

class CustomChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        if obj == '' and self.allow_blank:
            return obj
        return self._choices.get(obj, obj) 
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

class LabTestChildsSerializer(serializers.ModelSerializer):
    # this is IMPORTANT, without this the 'id' field won't appear in validated data
    id = serializers.IntegerField()

    class Meta:
        model = LabTest
        fields = ('id',)

class LabTestSerializer(serializers.ModelSerializer):
    def iexact_name():
        return [ UniqueValidator( 
                queryset=LabTest.objects.all(), 
                message = _('There is already another lab test with this name. It may be an Inactive Test. Please contact the admin.'), 
                lookup = 'iexact',
                )]
    group = serializers.SlugRelatedField(queryset=LabTestGroup.active.all(), slug_field='name', allow_null=True, required=False)
    group_choices =  serializers.SerializerMethodField(read_only=True)
    sample_type = CustomChoiceField(choices=Sample.SAMPLE_TYPE)
    sample_type_choices =  serializers.SerializerMethodField(read_only=True)
    type = CustomChoiceField(choices=LabTest.LABTEST_TYPE, default=LabTest.LABTEST_TYPE[0][0])
    type_choices = serializers.SerializerMethodField(read_only=True)
    childs = LabTestChildsSerializer(many=True, allow_null=True)
    code = serializers.CharField( validators = iexact_name() )
    
    class Meta:
        model = LabTest
        fields = ('__all__')

    def get_type_choices(self, obj):
        return [value for key, value in LabTest.LABTEST_TYPE]
    
    def get_sample_type_choices(self, obj):
        return [value for key, value in Sample.SAMPLE_TYPE]
    
    def get_group_choices(self, obj):
        return [None] + list(LabTestGroup.active.all().values_list('name', flat=True))
    
    def validate_childs(self, data):
        child_ids = []
        if self.initial_data.get('type') == LabTest.LABTEST_TYPE[0][1]:
            return child_ids
        for child in data:
            if (LabTest.active.all().get(id=child.get('id')).id == self.initial_data.get('id')): # Sub test same id as Test
                raise serializers.ValidationError(_('The current test cannot be also a sub test.'))
            if (LabTest.active.all().get(id=child.get('id')).type is not LabTest.LABTEST_TYPE[0][0]):
                raise serializers.ValidationError(_('All sub tests must be single tests.'))
            child_ids.append(child.get('id'))
        return child_ids # Array de ids

    def create(self, validated_data):
        childs = validated_data.pop('childs', [])
        labtest = super().create(validated_data=validated_data)
        labtest.childs.set(childs)
        return labtest

    def update(self, instance, validated_data):
        childs = validated_data.pop('childs', [])
        labtest = super().update(instance=instance, validated_data=validated_data)
        labtest.childs.set(childs)
        return labtest

class LabTestListSerializer(LabTestSerializer):
    class Meta:
        model = LabTest
        fields = ('id', 'code', 'name', 'ub', 'group', 'type')
        

class LabTestGroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=LabTestGroup.objects.all(),
                message=_("There is already another lab test group with this name."),
                lookup='iexact',
            )
        ]
    )
    class Meta:
        model = LabTestGroup
        fields = ('id', 'name')

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
    gender_choices = serializers.SerializerMethodField(read_only=True)
    id_type_choices = serializers.SerializerMethodField(read_only=True)
    healthcare_provider_choices = serializers.SerializerMethodField(read_only=True)
    birthday = serializers.DateField(required=False, allow_null=True, default=None) 

    class Meta:
        model = Patient
        fields = '__all__'
       
    def get_gender_choices(self, obj):
        return [value for key, value in Patient.GENDER]
    
    def get_id_type_choices(self, obj):
        return [value for key, value in Patient.ID_TYPE]
    
    def get_healthcare_provider_choices(self, obj):
        return [None] + list(HealthcareProvider.objects.only('name').values_list('name', flat=True))

class PatientListSerializer(PatientSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'first_name', 'last_name', 'id_type', 'id_number', 'healthcare_provider', 'age', 'birthday')

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
