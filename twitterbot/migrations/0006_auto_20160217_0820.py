# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0005_auto_20160209_0719'),
    ]

    operations = [
        migrations.AlterField(
            model_name='twitterresponse',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='twittersearch',
            name='refresh_url',
            field=models.CharField(null=True, blank=True, max_length=255),
        ),
    ]
