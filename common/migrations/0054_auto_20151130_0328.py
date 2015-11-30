# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0053_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='officer',
            name='allegations_count',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='birth_year',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='discipline_count',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
