# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import api.models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20151028_0420'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='setting',
            name='key',
        ),
        migrations.RemoveField(
            model_name='setting',
            name='value',
        ),
        migrations.AddField(
            model_name='setting',
            name='site_title',
            field=models.CharField(default='Police Misconduct in Chicago', max_length=255),
        ),
        migrations.AddField(
            model_name='setting',
            name='story_types_order',
            field=models.TextField(default=api.models._default_story_types_order),
        ),
    ]
