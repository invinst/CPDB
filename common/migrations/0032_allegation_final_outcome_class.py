# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0031_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='final_outcome_class',
            field=models.CharField(null=True, max_length=20),
        ),
    ]
