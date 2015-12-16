# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0054_auto_20151215_0358'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
