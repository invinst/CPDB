# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0014_auto_20150602_0346'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='document_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='allegation',
            name='document_normalized_title',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='allegation',
            name='document_title',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
