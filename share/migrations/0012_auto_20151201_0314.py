# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0011_session_alias'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='session',
            name='alias',
        ),
        migrations.RemoveField(
            model_name='session',
            name='searchable',
        ),
    ]
