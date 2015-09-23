# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0005_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='alias',
            name='num_suggestions',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='alias',
            name='num_usage',
            field=models.IntegerField(default=0),
        ),
    ]
