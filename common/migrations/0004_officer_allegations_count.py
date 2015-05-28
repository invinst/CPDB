# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_complainingwitness_officerhistory_policewitness'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='allegations_count',
            field=models.IntegerField(default=0),
        ),
    ]
