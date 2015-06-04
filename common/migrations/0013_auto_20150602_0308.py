# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0012_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='discipline_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='crid',
            field=models.CharField(null=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='end_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='final_outcome',
            field=models.CharField(null=True, max_length=5),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='start_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='allegationcategory',
            name='category',
            field=models.CharField(null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='area',
            name='type',
            field=models.CharField(choices=[['beat', 'Beat'], ['neighborhood', 'Neighborhood'], ['school-grounds', 'School Grounds'], ['ward', 'Ward'], ['police-districts', 'Police District']], max_length=30),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_first',
            field=models.CharField(null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_last',
            field=models.CharField(null=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='officer',
            name='star',
            field=models.FloatField(null=True),
        ),
    ]
