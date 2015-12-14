# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0053_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
