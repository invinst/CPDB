# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='twittersearch',
            name='query',
            field=models.CharField(max_length=100, default=''),
            preserve_default=False,
        ),
    ]
