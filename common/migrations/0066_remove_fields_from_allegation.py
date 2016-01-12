# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0065_ofiicerallegation_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allegation',
            name='cat',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='final_finding',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='final_outcome',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='final_outcome_class',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='officer',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='recc_finding',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='recc_outcome',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='start_date',
        ),
    ]
