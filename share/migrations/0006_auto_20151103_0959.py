# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0005_auto_20151014_0255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='created_at',
            field=models.DateTimeField(null=True, default=django.utils.timezone.now),
        ),
    ]
