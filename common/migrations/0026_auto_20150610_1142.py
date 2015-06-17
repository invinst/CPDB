# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0025_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='officer',
            name='rank_display',
        ),
        migrations.AlterField(
            model_name='officer',
            name='star',
            field=models.FloatField(null=True),
        ),
    ]
