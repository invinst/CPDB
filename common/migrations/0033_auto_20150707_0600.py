# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0032_allegation_final_outcome_class'),
    ]

    operations = [
        migrations.AddField(
            model_name='area',
            name='extra1',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='area',
            name='extra2',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='area',
            name='extra3',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='area',
            name='extra4',
            field=models.CharField(max_length=30, null=True),
        ),
    ]
