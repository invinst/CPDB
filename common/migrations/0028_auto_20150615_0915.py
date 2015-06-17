# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0027_allegation_investigator'),
    ]

    operations = [
        migrations.AddField(
            model_name='complainingwitness',
            name='crid',
            field=models.CharField(null=True, max_length=30, db_index=True),
        ),
        migrations.AddField(
            model_name='policewitness',
            name='crid',
            field=models.CharField(null=True, max_length=30, db_index=True),
        ),
    ]
