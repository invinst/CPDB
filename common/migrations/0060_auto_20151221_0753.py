# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0059_auto_20151221_0718'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allegation',
            name='cat',
            field=models.ForeignKey(related_name='allegation_category', null=True, to='common.AllegationCategory'),
        ),
    ]
