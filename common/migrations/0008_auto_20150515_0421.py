# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0007_auto_20150515_0228'),
    ]

    operations = [
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(max_length=30, choices=[['beat', 'Beat'], ['neighborhood', 'Neighborhood'], ['school-grounds', 'School Grounds'], ['ward', 'Ward'], ['police-district', 'Police District']])),
                ('polygon', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326, blank=True, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='allegation',
            name='areas',
            field=models.ManyToManyField(blank=True, to='common.Area'),
        ),
    ]
