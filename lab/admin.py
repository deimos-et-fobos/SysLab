from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from lab.models import Culture, Doctor, HealthcareProvider, LabTest, LabTestGroup, LabTestResult, Patient, Protocol, Sample

class CultureAdmin(admin.ModelAdmin):
    model = Culture
    @admin.display(description=_('protocol'))
    def get_protocol(self, obj):
        return f"#{obj.labtest_result.protocol}"
    list_display = ('get_protocol', 'labtest_result', 'medicine', 'resistance', 'is_active')

class DoctorAdmin(admin.ModelAdmin):
    model = Doctor
    list_display = ('full_name', 'specialty', 'medical_license', 'is_active')

class HealthcareProviderAdmin(admin.ModelAdmin):
    model = HealthcareProvider
    list_display = ('name', 'is_active')

class LabTestParentInline(admin.TabularInline):
    model = LabTest.childs.through
    fk_name = 'to_labtest'
    extra = 1
    verbose_name = _('parent')
    verbose_name_plural = _('parents')

class LabTestAdmin(admin.ModelAdmin):
    model = LabTest
    list_display = [field.name for field in LabTest._meta.fields if field.name != 'id'] + ['parents']
    # list_display = ('code', 'doctor', 'laboratory', 'user', 'status', 'is_active')
    list_filter = ('type',)
    filter_horizontal = ('childs',)

    def get_exclude(self, request, obj):
        exclude = super().get_exclude(request, obj)
        if not exclude:
            exclude = []
        if obj.type == '0':
            exclude += ['childs']
        return exclude

    def get_inlines(self, request, obj):
        inlines = super().get_inlines(request, obj)
        if not inlines:
            inlines = []
        if obj.type == '0':
            inlines += [LabTestParentInline]
        return inlines


class LabTestGroupAdmin(admin.ModelAdmin):
    model = LabTestGroup
    list_display = ('name', 'is_active')

class LabTestResultAdmin(admin.ModelAdmin):
    model = LabTestResult
    @admin.display(description=_('patient'))
    def get_patient(self, obj):
        return obj.protocol.patient
    @admin.display(description=_('parent'))
    def get_test_parent(self, obj):
        return obj.parent
    @admin.display(boolean=True,description=_('culture'))
    def get_has_cultures(self, obj):
        return obj.test.is_culture

    list_filter = ('test__is_culture',)
    # list_display = ['get_patient'] + [field.name for field in LabTestResult._meta.fields if field.name != 'id']
    list_display = ('protocol', 'get_patient', 'get_test_parent', 'test', 'get_has_cultures', 'value', 'status', 'observations', 'is_active')

class PatientAdmin(admin.ModelAdmin):
    model = Patient
    @admin.display(description=_('Birthday'))
    def admin_birthday(self, obj):
        return obj.birthday.strftime('%d/%m/%Y')
    list_display = ('full_name', 'id_number', 'healthcare_provider', 'admin_birthday', 'is_active')

class ProtocolAdmin(admin.ModelAdmin):
    model = Protocol
    list_display = [field.name for field in Protocol._meta.fields]
    # list_display = ('patient', 'doctor', 'laboratory', 'user', 'status', 'is_active')

class SampleAdmin(admin.ModelAdmin):
    model = Sample
    @admin.display(description=_('patient'))
    def get_patient(self, obj):
        return obj.protocol.patient

    list_display = ['get_patient'] + [field.name for field in Sample._meta.fields if field.name != 'id']
    # list_display = ('protocol', 'get_patient', 'type', 'status', 'checkin_time', 'is_active')


admin.site.register(Culture, CultureAdmin)
admin.site.register(Doctor, DoctorAdmin)
admin.site.register(HealthcareProvider, HealthcareProviderAdmin)
admin.site.register(LabTest, LabTestAdmin)
admin.site.register(LabTestGroup, LabTestGroupAdmin)
admin.site.register(LabTestResult, LabTestResultAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Protocol, ProtocolAdmin)
admin.site.register(Sample, SampleAdmin)
