# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0003_auto_20151009_0919'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='created_at',
            field=models.DateTimeField(null=True, auto_now_add=True),
        ),
    ]
