# Generated by Django 4.1 on 2023-06-11 13:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_labmember_managers_alter_laboratory_managers_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='labmember',
            options={'permissions': (('list_labmember', 'Can list lab member'),), 'verbose_name': 'laboratory member', 'verbose_name_plural': 'laboratory members'},
        ),
    ]
