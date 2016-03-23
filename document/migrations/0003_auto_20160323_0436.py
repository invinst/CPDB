# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0002_requestemail_session'),
    ]

    operations = [
        migrations.AlterField(
            model_name='requestemail',
            name='session',
            field=models.ForeignKey(null=True, to='share.Session'),
        ),
    ]
