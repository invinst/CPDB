# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0056_remove_allegation_cat'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allegation',
            name='cat',
        ),
    ]
