# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0001_initial'),
        ('document', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='requestemail',
            name='session',
            field=models.ForeignKey(default=1, to='share.Session'),
            preserve_default=False,
        ),
    ]
