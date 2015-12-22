# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0058_auto_20151221_0717'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allegationcategory',
            name='cat_id',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='allegationcategory',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
    ]
