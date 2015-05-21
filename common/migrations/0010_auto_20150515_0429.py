# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0009_auto_20150515_0424'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allegation',
            name='beat',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='neighborhood',
        ),
        migrations.DeleteModel(
            name='Beat',
        ),
        migrations.DeleteModel(
            name='Neighborhood',
        ),
    ]
