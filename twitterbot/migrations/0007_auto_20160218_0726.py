# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0006_auto_20160217_0820'),
    ]

    operations = [
        migrations.AlterField(
            model_name='response',
            name='type',
            field=models.CharField(max_length=20, choices=[['officer', 'officer'], ['investigator', 'investigator'], ['not_found', 'not_found']]),
        ),
    ]
