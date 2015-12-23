# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0059_auto_20151222_0814'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allegation',
            name='cat',
            field=models.ForeignKey(to='common.AllegationCategory', null=True),
        ),
    ]
