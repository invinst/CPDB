# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('title', models.CharField(max_length=254)),
                ('url', models.URLField(blank=True, default='')),
                ('slug', models.SlugField(max_length=254)),
                ('short_description', models.TextField()),
                ('content', models.TextField(blank=True, default='')),
                ('story_type', models.CharField(max_length=254)),
                ('created_date', models.DateField(blank=True, null=True)),
                ('custom_order', models.IntegerField(default=1)),
                ('officer', models.ForeignKey(to='common.Officer')),
            ],
            options={
                'verbose_name_plural': 'Stories',
            },
        ),
    ]
