# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0003_response'),
    ]

    operations = [
        migrations.AddField(
            model_name='twitterresponse',
            name='user',
            field=models.CharField(max_length=50, default=''),
        ),
    ]
