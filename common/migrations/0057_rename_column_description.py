# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0056_pending_pdf_allegation'),
    ]

    operations = [
        migrations.RenameField(
            model_name='allegation',
            old_name='description',
            new_name='summary',
        ),
    ]
