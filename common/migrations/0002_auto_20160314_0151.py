# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allegation',
            name='document_id',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='document_normalized_title',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='document_pending',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='document_requested',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='document_title',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='last_requested',
        ),
        migrations.RemoveField(
            model_name='allegation',
            name='number_of_request',
        ),
    ]
