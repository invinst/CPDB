# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='officerallegation',
            name='officer_age',
            field=models.IntegerField(null=True, db_index=True),
        ),
    ]
