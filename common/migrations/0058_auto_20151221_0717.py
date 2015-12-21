# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0057_auto_20151221_0708'),
    ]

    operations = [
        migrations.RenameField(
            model_name='allegation',
            old_name='allegation_category',
            new_name='cat',
        ),
    ]
