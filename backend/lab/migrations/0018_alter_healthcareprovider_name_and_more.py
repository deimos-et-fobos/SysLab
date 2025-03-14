# Generated by Django 4.1 on 2023-06-08 14:06

from django.db import migrations, models
import django.db.models.functions.text


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0017_alter_doctor_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='healthcareprovider',
            name='name',
            field=models.CharField(max_length=120, verbose_name='name'),
        ),
        migrations.AddConstraint(
            model_name='healthcareprovider',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('name'), name='unique_iexact_name'),
        ),
    ]
