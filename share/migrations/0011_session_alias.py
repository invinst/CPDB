# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0010_session_searchable'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='alias',
            field=models.CharField(blank=True, null=True, max_length=254),
        ),
    ]
