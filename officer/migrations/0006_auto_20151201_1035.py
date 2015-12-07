# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('officer', '0005_auto_20151015_1023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='content',
            field=models.TextField(default='', blank=True),
        ),
    ]
