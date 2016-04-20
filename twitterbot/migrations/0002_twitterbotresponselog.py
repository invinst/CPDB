# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TwitterBotResponseLog',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('matched_strings', models.TextField(blank=True, null=True)),
                ('entity_url', models.URLField()),
                ('tweet_url', models.URLField()),
                ('tweet_content', models.TextField()),
                ('tweeted_at', models.DateTimeField()),
                ('incoming_tweet_username', models.CharField(max_length=50)),
                ('incoming_tweet_url', models.URLField()),
                ('incoming_tweet_content', models.TextField()),
                ('originating_tweet_username', models.CharField(blank=True, max_length=50, null=True)),
                ('originating_tweet_url', models.URLField(blank=True, null=True)),
                ('originating_tweet_content', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
