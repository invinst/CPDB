# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0009_filterlog_user_agent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='filterlog',
            name='ip',
        ),
        migrations.RemoveField(
            model_name='filterlog',
            name='user_agent',
        ),
    ]
