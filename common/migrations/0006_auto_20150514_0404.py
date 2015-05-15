# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0005_auto_20150514_0401'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allegation',
            name='beat',
        ),
        migrations.RenameField(
            model_name='allegation',
            old_name='beat_obj',
            new_name='beat'
        ),
    ]
