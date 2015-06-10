# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0019_investigator'),
    ]

    operations = [
        migrations.RenameField(
            model_name='allegation',
            old_name='investigator',
            new_name='investigator_name',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='investigator',
            new_name='investigator_name',
        ),
    ]
