# Generated by Django 4.1 on 2023-06-12 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_labmember_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customuser',
            options={'permissions': (('list_customuser', 'Can list CustomUser'),), 'verbose_name': 'user', 'verbose_name_plural': 'users'},
        ),
    ]
