# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0054_allegation_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='PendingPdfAllegation',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('crid', models.CharField(max_length=30, null=True, db_index=True)),
                ('raw_content', models.TextField(blank=True, null=True)),
                ('notification_date', models.DateField(blank=True, null=True)),
                ('finding', models.CharField(null=True, blank=True, max_length=255)),
                ('summary', models.TextField(blank=True, null=True)),
                ('errors', models.TextField(blank=True, null=True)),
                ('areas', models.ManyToManyField(to='common.Area', blank=True)),
                ('cat', models.ForeignKey(to='common.AllegationCategory', null=True, blank=True)),
            ],
        ),
    ]
