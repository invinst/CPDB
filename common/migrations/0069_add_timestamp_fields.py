# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0068_populate_allegation_foreign_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 1, 6, 5, 19, 12, 942713)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='allegation',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 1, 6, 5, 19, 16, 654632)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='allegationcategory',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 1, 6, 5, 19, 18, 702553)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='allegationcategory',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 1, 6, 5, 19, 20, 654454)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='area',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 1, 6, 5, 19, 22, 150439)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='area',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 1, 6, 5, 19, 23, 582351)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='investigator',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 1, 6, 5, 19, 25, 30291)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='investigator',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 1, 6, 5, 19, 26, 398399)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='officer',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 1, 6, 5, 19, 27, 838309)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='officer',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 1, 6, 5, 19, 29, 238185)),
            preserve_default=False,
        ),
    ]
