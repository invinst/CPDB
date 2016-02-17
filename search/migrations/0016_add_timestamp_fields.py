# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0015_sessionalias_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='sessionalias',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 1, 6, 5, 2, 47, 252382)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sessionalias',
            name='modified_at',
            field=models.DateTimeField(default=datetime.datetime(2016, 1, 6, 5, 3, 11, 547732), auto_now=True),
            preserve_default=False,
        ),
    ]
