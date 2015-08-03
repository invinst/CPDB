# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0033_auto_20150723_0957'),
    ]

    operations = [
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=254)),
                ('slug', models.SlugField(max_length=254)),
                ('short_description', models.TextField()),
                ('content', models.TextField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('custom_order', models.IntegerField(default=1)),
                ('officer', models.ForeignKey(to='common.Officer')),
            ],
        ),
    ]
