# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('document', '0002_requestemail_session'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('documentcloud_id', models.IntegerField(null=True, blank=True)),
                ('normalized_title', models.CharField(null=True, max_length=255, blank=True)),
                ('title', models.CharField(null=True, max_length=255, blank=True)),
                ('requested', models.BooleanField(default=False)),
                ('pending', models.BooleanField(default=False)),
                ('number_of_request', models.IntegerField(default=0)),
                ('last_requested', models.DateTimeField(default=django.utils.timezone.now)),
                ('type', models.CharField(max_length=10, choices=[('CR', 'CR'), ('CPB', 'CPB')])),
                ('allegation', models.ForeignKey(to='common.Allegation', related_name='documents')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
