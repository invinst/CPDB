# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0021_auto_20150610_0353'),
    ]

    operations = [
        migrations.AddField(
            model_name='complaint',
            name='investigator',
            field=models.ForeignKey(to='common.Investigator', null=True),
        ),
    ]
