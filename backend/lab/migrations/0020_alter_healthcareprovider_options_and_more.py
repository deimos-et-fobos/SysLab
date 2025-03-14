# Generated by Django 4.1 on 2023-06-09 14:40

from django.db import migrations, models
import django.db.models.functions.text


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0019_remove_healthcareprovider_unique_iexact_name_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='healthcareprovider',
            options={'ordering': [django.db.models.functions.text.Lower('name')], 'permissions': (('list_healthcareprovider', 'Can list healthcare provider'),), 'verbose_name': 'healthcare provider', 'verbose_name_plural': 'healthcare providers'},
        ),
        migrations.AlterField(
            model_name='patient',
            name='gender',
            field=models.CharField(blank=True, choices=[('', '-----'), ('0', 'Male'), ('1', 'Female'), ('2', 'Non-Binary'), ('3', 'Other')], default='', max_length=1, null=True, verbose_name='gender'),
        ),
        migrations.AlterField(
            model_name='patient',
            name='id_type',
            field=models.CharField(blank=True, choices=[('', '-----'), ('0', 'DNI'), ('1', 'LE'), ('2', 'LC'), ('3', 'Passport'), ('4', 'Other')], default='', max_length=1, null=True, verbose_name='ID type'),
        ),
    ]
