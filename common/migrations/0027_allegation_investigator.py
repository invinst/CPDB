# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0026_auto_20150610_1142'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='investigator',
            field=models.ForeignKey(null=True, to='common.Investigator'),
        ),
    ]
