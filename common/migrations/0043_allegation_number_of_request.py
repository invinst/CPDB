# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0042_auto_20150925_0747'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='number_of_request',
            field=models.IntegerField(default=0),
        ),
    ]
