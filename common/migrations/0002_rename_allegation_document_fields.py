# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='allegation',
            old_name='number_of_request',
            new_name='total_document_requests',
        ),
        migrations.RenameField(
            model_name='allegation',
            old_name='last_requested',
            new_name='last_document_requested',
        ),
    ]
