# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('officer', '0002_auto_20150805_0316'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='url',
            field=models.URLField(blank=True, default=''),
        ),
    ]
