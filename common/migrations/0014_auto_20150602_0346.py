# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0013_auto_20150602_0308'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegationcategory',
            name='allegation_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='allegationcategory',
            name='category_count',
            field=models.IntegerField(default=0),
        ),
    ]
