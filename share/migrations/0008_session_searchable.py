# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0007_session_active_tab'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='searchable',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
