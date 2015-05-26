# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_complainingwitness_officerhistory_policewitness'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allegation',
            name='crid',
            field=models.CharField(verbose_name='Complaint ID', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='end_date',
            field=models.DateField(verbose_name='End date', null=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='final_outcome',
            field=models.CharField(verbose_name='Discipline type', max_length=5, null=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='start_date',
            field=models.DateField(verbose_name='Start date', null=True),
        ),
        migrations.AlterField(
            model_name='allegationcategory',
            name='category',
            field=models.CharField(verbose_name='Complaint type', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_first',
            field=models.CharField(verbose_name='Officer first name', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_last',
            field=models.CharField(verbose_name='Officer last name', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='star',
            field=models.FloatField(verbose_name='Badge number', null=True),
        ),
    ]
