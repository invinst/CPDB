# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0045_auto_20151027_0851'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='last_requested',
            field=models.DateTimeField(default=django.utils.timezone.now),
        )
    ]
