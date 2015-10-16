# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0008_alias_updated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='filterlog',
            name='user_agent',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
