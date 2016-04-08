# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ResponseTemplate',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('response_type', models.CharField(choices=[['officer', 'officer'], ['investigator', 'investigator']], max_length=20)),
                ('message', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='TwitterBotError',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('stack_trace', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        )
    ]
