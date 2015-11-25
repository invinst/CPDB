# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_extensions.db.fields.json


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0008_auto_20151120_0414'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='query',
            field=django_extensions.db.fields.json.JSONField(blank=True),
        ),
    ]
