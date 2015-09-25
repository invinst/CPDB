# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0007_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='alias',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 9, 23, 8, 53, 19, 120888, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
