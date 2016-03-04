# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='response',
            old_name='type',
            new_name='response_type',
        ),
    ]
