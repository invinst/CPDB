# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0010_auto_20151009_0919'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='suggestionlog',
            name='ip',
        ),
    ]
