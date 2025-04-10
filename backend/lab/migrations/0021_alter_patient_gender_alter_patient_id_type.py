# Generated by Django 4.1 on 2023-06-11 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0020_alter_healthcareprovider_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='gender',
            field=models.CharField(blank=True, choices=[('', ''), ('0', 'Male'), ('1', 'Female'), ('2', 'Non-Binary'), ('3', 'Other')], default='', max_length=1, null=True, verbose_name='gender'),
        ),
        migrations.AlterField(
            model_name='patient',
            name='id_type',
            field=models.CharField(blank=True, choices=[('', ''), ('0', 'DNI'), ('1', 'LE'), ('2', 'LC'), ('3', 'Passport'), ('4', 'Other')], default='', max_length=1, null=True, verbose_name='ID type'),
        ),
    ]
