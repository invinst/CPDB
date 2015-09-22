# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0038_auto_20150806_0811'),
    ]

    operations = [
        migrations.AddField(
            model_name='investigator',
            name='current_rank',
            field=models.CharField(null=True, max_length=50),
        ),
        migrations.AddField(
            model_name='investigator',
            name='current_report',
            field=models.CharField(null=True, max_length=4),
        ),
    ]
