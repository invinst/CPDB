# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0006_auto_20151103_0959'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='active_tab',
            field=models.CharField(max_length=40, default=''),
        ),
    ]
