# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0009_auto_20151123_0505'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='sunburst_arc',
            field=models.CharField(max_length=40, blank=True, default=''),
        ),
    ]
