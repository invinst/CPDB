# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0015_auto_20150604_0248'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allegation',
            name='crid',
            field=models.CharField(db_index=True, null=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='incident_date',
            field=models.DateTimeField(db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='investigator',
            field=models.CharField(db_index=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegationcategory',
            name='allegation_name',
            field=models.CharField(db_index=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegationcategory',
            name='category',
            field=models.CharField(db_index=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='area',
            name='type',
            field=models.CharField(db_index=True, max_length=30, choices=[['beat', 'Beat'], ['neighborhood', 'Neighborhood'], ['school-grounds', 'School Grounds'], ['ward', 'Ward'], ['police-districts', 'Police District']]),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_first',
            field=models.CharField(db_index=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_last',
            field=models.CharField(db_index=True, null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='officer',
            name='star',
            field=models.FloatField(db_index=True, null=True),
        ),
    ]
