# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0034_allegation_document_requested'),
    ]

    operations = [
        migrations.AddField(
            model_name='investigator',
            name='discipline_count',
            field=models.IntegerField(default=0),
        ),
    ]
