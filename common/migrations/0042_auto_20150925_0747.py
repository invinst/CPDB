# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0041_officer_birth_year'),
    ]

    operations = [
        migrations.AlterField(
            model_name='officer',
            name='allegations_count',
            field=models.IntegerField(default=0, blank=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='appt_date',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='birth_year',
            field=models.IntegerField(default=0, blank=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='discipline_count',
            field=models.IntegerField(default=0, blank=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='gender',
            field=models.CharField(null=True, blank=True, max_length=1),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_first',
            field=models.CharField(null=True, blank=True, db_index=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_last',
            field=models.CharField(null=True, blank=True, db_index=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='officer',
            name='race',
            field=models.CharField(null=True, blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='officer',
            name='rank',
            field=models.CharField(null=True, blank=True, max_length=5),
        ),
        migrations.AlterField(
            model_name='officer',
            name='star',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='unit',
            field=models.CharField(null=True, blank=True, max_length=5),
        ),
    ]
