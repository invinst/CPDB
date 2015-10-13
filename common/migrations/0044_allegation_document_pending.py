# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0043_allegation_number_of_request'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='document_pending',
            field=models.BooleanField(default=False),
        ),
    ]
