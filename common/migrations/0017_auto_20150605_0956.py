# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0016_auto_20150604_0250'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='incident_date_only',
            field=models.DateField(null=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='incident_date',
            field=models.DateTimeField(null=True),
        ),
    ]
