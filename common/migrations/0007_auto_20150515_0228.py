# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0006_auto_20150514_0404'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='neighborhood',
            field=models.ForeignKey(blank=True, null=True, to='common.Neighborhood'),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='beat',
            field=models.ForeignKey(blank=True, null=True, to='common.Beat'),
        ),
    ]
