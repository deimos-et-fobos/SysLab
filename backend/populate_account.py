import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'syslab.settings')

import django
django.setup()

# FAKE POP SCRIPT
import random
from django.contrib.auth.models import Group
from accounts.models import CustomUser, Laboratory, UserType
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

roles = ['Administrador', 'Bioquimico', 'Técnico']

def populate_usertype():
    for rol in roles:
        group = Group.objects.get_or_create(name=rol)[0]
        usertype = UserType.objects.get_or_create(type=rol,group=group)[0]

def populate_user(N=5):
    usertypes = UserType.objects.all()
    if N > len(emails):
        N = len(emails)
    for entry in range(N):
        fake_firstname = fakegen.first_name()
        fake_lastname = fakegen.last_name()
        fake_email = emails[entry]
        fake_password = 'richi'
        type = random.choice(usertypes)
        if not entry:
            user = CustomUser.objects.get_or_create(email=fake_email,first_name=fake_firstname, last_name=fake_lastname, type=type, is_staff=True, is_superuser=True)[0]
        user = CustomUser.objects.get_or_create(email=fake_email,first_name=fake_firstname, last_name=fake_lastname, type=type, is_staff=True)[0]
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



if __name__ == '__main__':
    print("Populating script...")
    print(" + Populating UserType")
    populate_usertype()
    print(" + Populating User")
    populate_user(5)
    print(" + Populating Laboratory")
    populate_lab(20)
    print("Populating complete!")
