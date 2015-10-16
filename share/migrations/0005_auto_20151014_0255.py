# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0004_auto_20151014_0253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='ip',
            field=models.CharField(default='', max_length=40, null=True),
        ),
    ]
