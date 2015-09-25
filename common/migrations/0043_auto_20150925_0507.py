# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0042_merge'),
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
            field=models.DateField(blank=True, null=True),
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
            field=models.CharField(max_length=1, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_first',
            field=models.CharField(db_index=True, max_length=255, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='officer_last',
            field=models.CharField(db_index=True, max_length=255, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='race',
            field=models.CharField(max_length=50, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='rank',
            field=models.CharField(max_length=5, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='star',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='unit',
            field=models.CharField(max_length=5, blank=True, null=True),
        ),
    ]
