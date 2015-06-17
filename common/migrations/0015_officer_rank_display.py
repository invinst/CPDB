# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0014_auto_20150602_0346'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='rank_display',
            field=models.CharField(null=True, max_length=50),
        ),
    ]
