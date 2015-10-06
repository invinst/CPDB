# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0040_complainingwitness_age'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='birth_year',
            field=models.IntegerField(default=0),
        ),
    ]
