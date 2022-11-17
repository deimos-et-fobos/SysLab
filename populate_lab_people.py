import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'syslab.settings')

import django
django.setup()

# FAKE POP SCRIPT
import random
from lab.models import Doctor, Patient, HealthcareProvider
from faker import Faker

fakegen = Faker()

# providers = ['OSDE','OSPE','IOSEP','SANCOR','DFAK','FADUC','IB','UNSE']
specialties = ['Urologo','Cardiologo','Cirujano','Dermatologo','Clinico','Pediatra','Neurologo','Hepatologo']

def populate_doctor(N=5):
    for entry in range(N):
        fake_firstname = fakegen.first_name()
        fake_lastname = fakegen.last_name()
        fake_license = fakegen.pyint(max_value=9999)
        fake_specialty = random.choice(specialties)
        doctor = Doctor.objects.get_or_create(first_name=fake_firstname, last_name=fake_lastname, medical_license=fake_license, specialty=fake_specialty)[0]

def populate_patient(N=5):
    providers = HealthcareProvider.objects.all()
    for entry in range(N):
        fake_firstname = fakegen.first_name()
        fake_lastname = fakegen.last_name()
        fake_id_type =  random.choice(Patient.ID_TYPE)[0]
        fake_id_number =  fakegen.pystr_format(letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ', string_format='??######')
        fake_birthday = fakegen.date()
        fake_age =  fakegen.pyint(max_value=100)
        fake_gender =  random.choice(Patient.GENDER)[0]
        fake_provider = random.choice(providers)
        fake_phone = fakegen.last_name()
        fake_address = fakegen.first_name()
        fake_email = fakegen.email()
        patient = Patient.objects.get_or_create(first_name=fake_firstname,last_name=fake_lastname,id_type=fake_id_type,id_number=fake_id_number,birthday=fake_birthday,age=fake_age,gender=fake_gender,healthcare_provider=fake_provider,phone=fake_phone,address=fake_address,email=fake_email)[0]

def populate_provider():
    for entry in range(len(providers)):
        fake_name = providers[entry]
        provider = HealthcareProvider.objects.get_or_create(name=fake_name)[0]

print(__name__)


if __name__ == '__main__':
    print("Populating script...")
    print(" + Populating HealthcareProvider")
    populate_provider()
    print(" + Populating Doctor")
    populate_doctor(20)
    print(" + Populating Patient")
    populate_patient(20)
    print("Populating complete!")
