# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0002_session_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='ip',
            field=models.CharField(max_length=40, default=''),
        ),
        migrations.AddField(
            model_name='session',
            name='user_agent',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
