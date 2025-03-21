# Generated by Django 4.1 on 2022-10-06 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab', '0002_alter_protocol_validation_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labtest',
            name='sample_type',
            field=models.CharField(blank=True, choices=[('#', ''), ('0', 'Blood'), ('1', 'Urine'), ('2', 'Vaginal discharge'), ('3', 'Semen'), ('4', 'Saliva'), ('5', 'Stool'), ('6', 'Other')], max_length=1, verbose_name='sample type'),
        ),
        migrations.AlterField(
            model_name='sample',
            name='type',
            field=models.CharField(choices=[('#', ''), ('0', 'Blood'), ('1', 'Urine'), ('2', 'Vaginal discharge'), ('3', 'Semen'), ('4', 'Saliva'), ('5', 'Stool'), ('6', 'Other')], default='#', max_length=1, verbose_name='type'),
        ),
    ]
