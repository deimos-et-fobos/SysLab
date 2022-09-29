import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'syslab.settings')

import django
django.setup()

# FAKE POP SCRIPT
import random
from accounts.models import CustomUser, Laboratory, LabMember, LabUserType
from faker import Faker

fakegen = Faker()

emails = ['richi@gmail.com',
            'gonci@gmail.com',
            'taso@gmail.com',
            'legui@gmail.com',
            'piki@gmail.com',
            'mami@gmail.com',
            'gigi@gmail.com',
            'pata@gmail.com',]

labs = ['UAM',
        '3 Arcos',
        'Urquiza',
        '3 Cerritos',
        'Privado',
        'Universitario',]

roles = ['Administrador', 'Bioquimico', 'Tecnico']

def populate_user(N=5):
    if N > len(emails):
        N = len(emails)
    for entry in range(N):
        fake_firstname = fakegen.first_name()
        fake_lastname = fakegen.last_name()
        fake_email = emails[entry]
        fake_password = 'richi'
        if not entry:
            user = CustomUser.objects.get_or_create(email=fake_email,first_name=fake_firstname, last_name=fake_lastname, is_staff=True, is_superuser=True)[0]
        user = CustomUser.objects.get_or_create(email=fake_email,first_name=fake_firstname, last_name=fake_lastname, is_staff=True)[0]
        user.set_password(fake_password)
        user.save()

def populate_lab(N=5):
    N = min(N,len(labs))
    for entry in range(N):
        fake_name = labs[entry]
        fake_address = fakegen.first_name()
        fake_email = fakegen.email()
        fake_phone = fakegen.last_name()
        fake_url = fakegen.url()
        lab = Laboratory.objects.get_or_create(name=fake_name,address=fake_address,email=fake_email,phone=fake_phone,url=fake_url)[0]

def populate_labusertype():
    labs = Laboratory.objects.all()
    for lab in labs:
        for rol in roles:
            labusertype = LabUserType.objects.get_or_create(laboratory=lab,type=rol)[0]

def populate_labmember(N=5):
    users = CustomUser.objects.all()
    labs = Laboratory.objects.all()
    N = min(N,len(labs)*len(users))
    for entry in range(N):
        lab = random.choice(labs)
        user = random.choice(users)
        user_type = random.choice( list(lab.labusertype_set.all()) + [None] )
        member = LabMember.objects.get_or_create(user=user,laboratory=lab)[0]
        member.user_type=user_type
        member.save()

if __name__ == '__main__':
    print("populating script!")
    populate_user(5)
    populate_lab(20)
    populate_labusertype()
    populate_labmember(20)
    print("populating complete!")
