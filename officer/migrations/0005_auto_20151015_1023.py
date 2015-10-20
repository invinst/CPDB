# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('officer', '0004_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='created_date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
