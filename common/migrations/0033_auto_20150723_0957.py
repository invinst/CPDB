# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0032_allegation_final_outcome_class'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complainingwitness',
            name='cwit_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='policewitness',
            name='pwit_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
