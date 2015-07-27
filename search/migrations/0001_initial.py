# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_extensions.db.fields.json


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FilterLog',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('query', django_extensions.db.fields.json.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('session_id', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='SuggestionLog',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('query', models.CharField(max_length=50)),
                ('num_suggestions', models.PositiveIntegerField(default=0)),
                ('session_id', models.CharField(max_length=100)),
            ],
        ),
    ]
