# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Response',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('type', models.CharField(choices=[['officer', 'officer'], ['investigator', 'investigator'], ['not_found', 'not_found']], max_length=20)),
                ('message', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='TwitterResponse',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('response', models.TextField()),
                ('user', models.CharField(default='', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='TwitterSearch',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('query', models.CharField(max_length=100)),
                ('refresh_url', models.CharField(blank=True, null=True, max_length=255)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='twitterresponse',
            name='search',
            field=models.ForeignKey(to='twitterbot.TwitterSearch'),
        ),
    ]
