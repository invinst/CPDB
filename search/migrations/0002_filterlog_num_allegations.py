# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='filterlog',
            name='num_allegations',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]
