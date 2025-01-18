from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from accounts.models import Laboratory

User = get_user_model()

STATUS = (
    ('0',_('Pendent')),
    ('1',_('On process')),
    ('2',_('Finished')),
    ('3',_('Validated')),
)

class ActiveObjectsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class HealthcareProvider(models.Model):
    name = models.CharField(_('name'), max_length=120)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.name}"

    def search(self, search):
        keys = search.split()
        objects = self.model.active.all()
        for key in keys:
            objects = objects.filter(name__icontains=key)
        return objects

    class Meta:
        ordering = [Lower('name')]
        permissions = (('list_healthcareprovider', "Can list healthcare provider"),)
        verbose_name = _('healthcare provider')
        verbose_name_plural = _('healthcare providers')
        constraints = [models.UniqueConstraint(Lower('name'),name='unique_iexact_name',violation_error_message=_('There is already another health provider with this name.'))]


class Patient(models.Model):
    ID_TYPE = (
        ('',_('')),
        ('0',_('DNI')),
        ('1',_('LE')),
        ('2',_('LC')),
        ('3',_('Passport')),
        ('4',_('Other')),
    )
    GENDER = (
        ('',_('')),
        ('0',_('Male')),
        ('1',_('Female')),
        ('2',_('Non-Binary')),
        ('3',_('Other')),
    )

    first_name = models.CharField(_('first name'), max_length=120)
    last_name = models.CharField(_('last name'), max_length=120)
    id_type = models.CharField(_('ID type'), choices=ID_TYPE, default='', max_length=1, blank=True, null=True)
    id_number = models.CharField(_('ID number'), max_length=30)
    birthday = models.DateField(_('date of birth'), blank=True, null=True)
    age = models.PositiveIntegerField(_('age'), blank=True, null=True)
    gender = models.CharField(_('gender'), choices=GENDER, default='', max_length=1, blank=True, null=True)
    healthcare_provider = models.ForeignKey(HealthcareProvider, verbose_name=_('healthcare provider'), on_delete=models.SET_NULL, null=True, blank=True)
    phone = models.CharField(_('phone'), max_length=30, blank=True)
    address = models.CharField(_('address'), max_length=150, blank=True)
    email = models.EmailField(_('email'), max_length=150, blank=True)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.full_name}"

    def _full_name(self):
        return f"{self.first_name} {self.last_name}"
    _full_name.short_description = _('name')
    full_name = property(_full_name)

    def search(self, search):
        keys = search.split()
        objects = self.model.active.all()
        for key in keys:
            objects = objects.filter(
                Q(first_name__icontains=key) |
                Q(last_name__icontains=key) |
                Q(id_number__icontains=key)
            )
        return objects

    class Meta:
        permissions = (('list_patient', "Can list patient"),)
        verbose_name = _('patient')
        verbose_name_plural = _('patients')


class Doctor(models.Model):
    first_name = models.CharField(_('first name'), max_length=120)
    last_name = models.CharField(_('last name'), max_length=120)
    medical_license = models.CharField(_('medical license'), max_length=10)
    specialty = models.CharField(_('specialty'), max_length=30, null=True, blank=True)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.full_name}"

    def _full_name(self):
        return f"{self.first_name} {self.last_name}"
    _full_name.short_description = _('name')
    full_name = property(_full_name)

    def get_full_info(self):
        return f"{self.full_name} ({self.specialty} - {self.medical_license})"

    def search(self, search):
        keys = search.split()
        objects = self.model.active.all()
        for key in keys:
            objects = objects.filter(
                Q(first_name__icontains=key) |
                Q(last_name__icontains=key) |
                Q(medical_license__icontains=key) |
                Q(specialty__icontains=key)
            )
        return objects

    class Meta:
        permissions = (('list_doctor', "Can list doctor"),)
        verbose_name = _('doctor')
        verbose_name_plural = _('doctors')


class Protocol(models.Model):
    laboratory = models.ForeignKey(Laboratory, verbose_name=_('laboratory'), on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, verbose_name=_('user'), on_delete=models.SET_NULL, null=True)
    patient = models.ForeignKey(Patient, verbose_name=_('patient'), on_delete=models.SET_NULL, null=True)
    doctor = models.ForeignKey(Doctor, verbose_name=_('doctor'), on_delete=models.SET_NULL, null=True)
    hc_provider = models.CharField(_('healthcare provider'), max_length=100, blank=True)
    hc_number = models.CharField(_('healthcare provider number'), max_length=100, blank=True)
    authorization_number = models.CharField(_('authorization number'), max_length=100, blank=True)
    ########
    # has_antibiogram = models.BooleanField(_('antibiogram'), default=False)
    is_urgent = models.BooleanField(_('urgent'), default=False)
    ########
    diagnosis = models.CharField(_('diagnosis'), max_length=255, null=True, blank=True)
    observations = models.CharField(_('observations'), max_length=120, null=True, blank=True)
    status = models.CharField(_('status'), choices=STATUS, max_length=1, blank=True)
    checkin_time = models.DateTimeField(_('check in time'), default=timezone.now, blank=True)
    extraction_time = models.DateTimeField(_('extraction time'), default=timezone.now, blank=True)
    validation_time = models.DateTimeField(_('validation time'), blank=True, null=True)
    timestamp = models.DateTimeField(_('timestamp'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.id}"

    class Meta:
        permissions = (('list_protocol', "Can list protocol"),)
        verbose_name = _('protocol')
        verbose_name_plural = _('protocols')


class Sample(models.Model):
    SAMPLE_TYPE = (
        ('',_('')),
        ('0',_('Blood')),
        ('1',_('Urine')),
        ('2',_('Vaginal discharge')),
        ('3',_('Semen')),
        ('4',_('Saliva')),
        ('5',_('Stool')),
        ('6',_('Other')),
    )

    protocol = models.ForeignKey(Protocol, verbose_name=_('protocol'), on_delete=models.SET_NULL, null=True)
    type = models.CharField(_('type'), choices=SAMPLE_TYPE, default='', max_length=1)
    received = models.BooleanField(_('received'), default=True)
    ### Agregar el default=timezone.now
    checkin_time = models.DateTimeField(_('check in time'), default=timezone.now)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.type}"

    class Meta:
        verbose_name = _('sample')
        verbose_name_plural = _('samples')


class LabTestGroup(models.Model):
    name = models.CharField(_('name'), max_length=50, unique=True)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.name}"

    class Meta:
        permissions = (('list_labtestgroup', "Can list lab test group"),)
        verbose_name = _('lab test group')
        verbose_name_plural = _('lab test groups')


class LabTest(models.Model):
    LABTEST_TYPE = (
        ('0',_('Single')),
        ('1',_('Compound')),
    )

    code = models.CharField(_('code'), max_length=30, unique=True)
    name = models.CharField(_('name'), max_length=50)
    ub = models.CharField(_('UB'), max_length=10, blank=True)
    method = models.CharField(_('method'), max_length=50, blank=True)
    price = models.CharField(_('price'), max_length=30, blank=True)
    group = models.ForeignKey(LabTestGroup, verbose_name=_('group'), on_delete=models.SET_NULL, null=True, blank=True)
    sample_type = models.CharField(_('sample type'), choices=Sample.SAMPLE_TYPE, default='', max_length=1, null=True, blank=True)
    type = models.CharField(_('type'), choices=LABTEST_TYPE, default='0', max_length=1)
    childs = models.ManyToManyField('self', verbose_name=_('childs'), symmetrical=False, related_name='parents', blank=True)
    is_antibiogram = models.BooleanField(_('antibiogram'), default=False)
    reference_value = models.CharField(_('reference value'), max_length=255, blank=True)
    unit = models.CharField(_('unit'), max_length=50, blank=True)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.name}"

    class Meta:
        permissions = (('list_labtest', "Can list lab test"),)
        verbose_name = _('lab test')
        verbose_name_plural = _('lab tests')


class LabTestResult(models.Model):
    protocol = models.ForeignKey(Protocol, verbose_name=_('protocol'), on_delete=models.SET_NULL, null=True)
    test = models.ForeignKey(LabTest, verbose_name=_('test'), related_name='labtest_results', on_delete=models.SET_NULL, null=True)
    parent = models.ForeignKey(LabTest, verbose_name=_('parent test'), related_name='labtest_parent_results', on_delete=models.SET_NULL, null=True, blank=True)
    value = models.CharField(_('value'), max_length=30, blank=True)
    status = models.CharField(_('status'), choices=STATUS, max_length=1, null=True, blank=True)
    observations = models.CharField(_('observations'), max_length=120, null=True, blank=True)
    test_time = models.DateTimeField(_('test time'), default=timezone.now, blank=True)
    timestamp = models.DateTimeField(_('timestamp'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        if self.test:
            return f"{self.id} - Test: {self.test.name}"
        return f"{self.id} - Test: {self.test}"

    class Meta:
        permissions = (('list_labtestresult', "Can list lab test result"),)
        verbose_name = _('lab test result')
        verbose_name_plural = _('lab test results')


class Antibiogram(models.Model):
    DEFAULT_MEDICINES = (
        'PENICILINA',
        'ACITROMICINA',
        'IBUPROFENO'
    )
    RESISTANCE = (
        ('',_('')),
        ('0',_('Sensitive')),
        ('1',_('Intermediate')),
        ('2',_('Resistant')),
    )
    ### CAPAZ QUE TENER EL PROTOCOLO ES REDUNDANTE ###
    protocol = models.ForeignKey(Protocol, verbose_name=_('protocol'), on_delete=models.SET_NULL, null=True)
    labtest_result = models.ForeignKey(LabTestResult, verbose_name=_('lab test result'), on_delete=models.SET_NULL, null=True)
    medicine = models.CharField(_('medicine'), max_length=30)
    resistance = models.CharField(_('resistance'), choices=RESISTANCE, default=RESISTANCE[0][0], max_length=1)
    is_active = models.BooleanField(_('active'), default=True)

    objects = models.Manager()
    active = ActiveObjectsManager()

    def __str__(self):
        return f"{self.labtest_result} - {self.medicine}"

    class Meta:
        permissions = (('list_antibiogram', "Can list antibiogram"),)
        verbose_name = _('antibiogram')
        verbose_name_plural = _('antibiograms')
