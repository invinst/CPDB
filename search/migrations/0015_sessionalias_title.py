# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0014_auto_20151203_0227'),
    ]

    operations = [
        migrations.AddField(
            model_name='sessionalias',
            name='title',
            field=models.CharField(max_length=254, default=''),
            preserve_default=False,
        ),
    ]
