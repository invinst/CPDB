# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0012_auto_20151201_0314'),
        ('search', '0012_auto_20151012_0924'),
    ]

    operations = [
        migrations.CreateModel(
            name='SessionAlias',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('alias', models.CharField(max_length=254)),
                ('session', models.ForeignKey(to='share.Session')),
            ],
        ),
    ]
