# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0046_auto_20151118_0955'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='beat',
            field=models.ForeignKey(to='common.Area', related_name='beats', null=True, blank=True),
        ),
    ]
