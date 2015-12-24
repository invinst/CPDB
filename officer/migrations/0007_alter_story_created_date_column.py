# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('officer', '0006_auto_20151201_1035'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='created_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
