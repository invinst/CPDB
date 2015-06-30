# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_extensions.db.fields.json


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('query', django_extensions.db.fields.json.JSONField()),
                ('share_count', models.IntegerField(default=0)),
                ('share_from', models.ForeignKey(default=None, to='share.Session', null=True)),
            ],
        ),
    ]
