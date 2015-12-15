# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0012_auto_20151201_0314'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='sunburst_arc',
            field=models.CharField(max_length=40, default='', blank=True),
        ),
    ]
