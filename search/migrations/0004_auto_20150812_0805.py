# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0003_auto_20150805_0316'),
    ]

    operations = [
        migrations.AddField(
            model_name='filterlog',
            name='ip',
            field=models.CharField(max_length=40, default=''),
        ),
        migrations.AddField(
            model_name='suggestionlog',
            name='ip',
            field=models.CharField(max_length=40, default=''),
        ),
    ]
