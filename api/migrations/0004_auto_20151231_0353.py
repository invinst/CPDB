# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20151112_1237'),
    ]

    operations = [
        migrations.AddField(
            model_name='setting',
            name='requested_document_email_subject',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='setting',
            name='requested_document_email_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
