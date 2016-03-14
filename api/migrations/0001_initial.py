# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import api.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InterfaceText',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('key', models.SlugField()),
                ('text', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('default_site_title', models.CharField(default='Police Misconduct in Chicago', max_length=255)),
                ('story_types_order', models.TextField(default=api.models._default_story_types_order)),
                ('requested_document_email_subject', models.CharField(blank=True, max_length=255, null=True)),
                ('requested_document_email_text', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
