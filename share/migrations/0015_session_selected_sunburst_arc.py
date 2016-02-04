# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_extensions.db.fields.json


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0014_auto_20160112_0358'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='selected_sunburst_arc',
            field=django_extensions.db.fields.json.JSONField(blank=True),
        ),
    ]
