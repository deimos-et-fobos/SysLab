# Generated by Django 5.1.7 on 2025-03-26 04:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_remove_laboratory_users_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usertype',
            options={'permissions': (('list_usertype', 'Can list UserTypes'),)},
        ),
    ]
