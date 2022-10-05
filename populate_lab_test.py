import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'syslab.settings')

import django
django.setup()
from django.db import models
from django.utils import timezone

# FAKE POP SCRIPT
import random
from accounts.models import Laboratory, CustomUser
from lab.models import Culture, Doctor, HealthcareProvider, LabTest, LabTestGroup, LabTestResult, Patient, Protocol, Sample
from faker import Faker

fakegen = Faker()

def populate_protocol(N=5):
    users = CustomUser.objects.all()
    labs = Laboratory.objects.all()
    patients = Patient.objects.all()
    doctors = Doctor.objects.all()
    providers = HealthcareProvider.objects.all()
    for entry in range(N):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        lab = random.choice(labs)
        user = random.choice(users)
        hc_provider = random.choice(providers).name
        hc_number = fakegen.pystr_format(string_format='########')
        authorization_number = fakegen.pystr_format(string_format='########')
        has_cultures = fakegen.pyint(max_value=9) == 0
        diagnosis = 'diagnostico'
        observations = 'observaciones'
        status = fakegen.pyint(max_value=3)
        protocol = Protocol.objects.get_or_create(user=user,laboratory=lab,doctor=doctor,patient=patient,hc_provider=hc_provider,hc_number=hc_number,authorization_number=authorization_number,has_cultures=has_cultures,diagnosis=diagnosis,observations=observations,status=status)[0]


def populate_labtestgroup():
    labtestgroups = ['Hemología','Quimica','Cultures','Cinetica']
    for entry in labtestgroups:
        name = entry
        labtestgroup = LabTestGroup.objects.get_or_create(name=name)[0]

def populate_sample():
    protocols = Protocol.objects.all()
    for protocol in protocols:
        for i in range(fakegen.pyint(min_value=1,max_value=3)):
            type = fakegen.pyint(max_value=6)
            received = fakegen.pyint(max_value=9) != 0
            if received:
                sample = Sample.objects.get_or_create(protocol=protocol,type=type,received=received,checkin_time=timezone.now())[0]
            else:
                sample = Sample.objects.get_or_create(protocol=protocol,type=type,received=received)[0]

def populate_simple_labtest(N=5):
    units = ['mm','mg/L','mm³','km','kg','N']
    methods = ['1','2','3','4','5','6']
    labtestgroups = LabTestGroup.objects.all()
    samples = Sample.objects.all()
    for i in range(N):
        code = fakegen.pyint(max_value=9999)
        if LabTest.objects.all().filter(code=code):
            continue
        name = fakegen.word()
        if LabTest.objects.all().filter(name=name):
            continue
        ub = fakegen.pyint(min_value=10,max_value=200,step=10)
        method = 'metodo ' + random.choice(methods)
        price = fakegen.pyint(max_value=1000)
        group = random.choice(labtestgroups)
        sample_type = fakegen.pyint(max_value=6)
        type = 0
        is_culture = fakegen.pyint(max_value=30) == 0
        reference_value = fakegen.pyint(max_value=1000)
        unit = random.choice(units)
        labtest = LabTest.objects.get_or_create(code=code,name=name,ub=ub,method=method,price=price,group=group,sample_type=sample_type,type=type,is_culture=is_culture,reference_value=reference_value,unit=unit)[0]

def populate_compuesto_labtest(N=10):
    units = ['']
    methods = ['1','2','3','4','5','6']
    labtestgroups = LabTestGroup.objects.all()
    samples = Sample.objects.all()
    simple_labtests = LabTest.objects.all().filter(type='0')
    for i in range(N):
        code = fakegen.pyint(max_value=9999)
        if LabTest.objects.all().filter(code=code):
            continue
        name = fakegen.word()
        if LabTest.objects.all().filter(name=name):
            continue
        ub = fakegen.pyint(min_value=10,max_value=200,step=10)
        method = 'metodo ' + random.choice(methods)
        price = fakegen.pyint(max_value=1000)
        group = random.choice(labtestgroups)
        sample_type = fakegen.pyint(max_value=6)
        type = 1
        is_culture = False
        reference_value = fakegen.pyint(max_value=1000)
        unit = random.choice(units)
        labtest = LabTest.objects.get_or_create(code=code,name=name,ub=ub,method=method,price=price,group=group,sample_type=sample_type,type=type,is_culture=is_culture,reference_value=reference_value,unit=unit)[0]
        childs = []
        for i in range(fakegen.pyint(min_value=3,max_value=10)):
            childs += [random.choice(simple_labtests)]
        labtest.childs.add(*childs)
        labtest.save()


def populate_labtestresult():
    protocols = Protocol.objects.all()
    labtests = LabTest.objects.all()
    for protocol in protocols:
        protocol = protocol
        for i in range(fakegen.pyint(min_value=3,max_value=10)):
            test = random.choice(labtests)
            childs = test.childs.all()
            value = fakegen.pyint(max_value=1000)
            status = fakegen.pyint(max_value=3)
            observations = 'observations ' + f'{fakegen.pyint(max_value=100)}'
            result = LabTestResult.objects.get_or_create(protocol=protocol,test=test,value=value,status=status,observations=observations)[0]
            parent = test
            for child in test.childs.all():
                test = child
                value = fakegen.pyint(max_value=1000)
                status = fakegen.pyint(max_value=3)
                observations = 'observations ' + f'{fakegen.pyint(max_value=100)}'
                result = LabTestResult.objects.get_or_create(protocol=protocol,test=test,parent=parent,value=value,status=status,observations=observations)[0]

def populate_culture():
    medicines = ['ibu','parecetamol','amoxicilina','iodo','morfina','penicilina','ciprofloxacina','medicamento 1','medicamento 2','medicamento 3','medicamento 4','medicamento 5','medicamento 6','medicamento 7','medicamento 8','medicamento 9']
    labtest = LabTest.objects.all().filter(is_culture=True)
    labtest_results = LabTestResult.objects.all().filter(test__in=labtest)
    for labtest_result in labtest_results:
        labtest_result = labtest_result
        protocol = labtest_result.protocol
        medicines_sample = random.sample(medicines, random.randint(3,10))
        for medicine in medicines_sample:
            resistance = random.randint(0,3)
            culture = Culture.objects.get_or_create(labtest_result=labtest_result,protocol=protocol,medicine=medicine,resistance=resistance)[0]


if __name__ == '__main__':
    print("Populating script...")
    print(" + Populating Protocol")
    populate_protocol(30)
    print(" + Populating Sample")
    populate_sample()
    print(" + Populating LabTestGroup")
    populate_labtestgroup()
    print(" + Populating LabTest")
    populate_simple_labtest(100)
    populate_compuesto_labtest(10)
    print(" + Populating LabTestResult")
    populate_labtestresult()
    print(" + Populating Culture")
    populate_culture()
    print("Populating complete!")
