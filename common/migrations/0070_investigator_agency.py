# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0069_add_timestamp_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='investigator',
            name='agency',
            field=models.CharField(choices=[['IPRA', 'IPRA'], ['IAD', 'IAD']], default='IAD', max_length=10),
            preserve_default=False,
        ),
    ]
