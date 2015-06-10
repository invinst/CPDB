# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0022_complaint_investigator'),
    ]

    operations = [
        migrations.RenameField(
            model_name='investigator',
            old_name='name',
            new_name='raw_name',
        ),
    ]
