# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.utils.timezone import utc
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 10, 9, 8, 33, 20, 244110, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
    ]
