# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0011_remove_suggestionlog_ip'),
    ]

    operations = [
        migrations.RenameField(
            model_name='filterlog',
            old_name='query',
            new_name='tag_name',
        ),
        migrations.RenameField(
            model_name='suggestionlog',
            old_name='query',
            new_name='search_query',
        ),
    ]
