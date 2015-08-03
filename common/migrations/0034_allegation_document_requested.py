# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0033_auto_20150723_0957'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='document_requested',
            field=models.BooleanField(default=False),
        ),
    ]
