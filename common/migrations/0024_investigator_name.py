# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0023_auto_20150610_0410'),
    ]

    operations = [
        migrations.AddField(
            model_name='investigator',
            name='name',
            field=models.CharField(max_length=160, default=''),
            preserve_default=False,
        ),
    ]
