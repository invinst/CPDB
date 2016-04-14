# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0009_policeunit_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='officer',
            name='unit',
        ),
        migrations.RemoveField(
            model_name='officerhistory',
            name='unit',
        ),
        migrations.RenameField(
            model_name='officer',
            old_name='unit_fk',
            new_name='unit',
        ),
        migrations.RenameField(
            model_name='officerhistory',
            old_name='unit_fk',
            new_name='unit',
        ),
    ]
