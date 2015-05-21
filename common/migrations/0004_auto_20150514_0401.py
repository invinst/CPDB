# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_complainingwitness_officerhistory_policewitness'),
    ]

    operations = [
        migrations.CreateModel(
            name='Beat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('polygon', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Neighborhood',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('polygon', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326, null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='allegation',
            name='point',
            field=django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='allegation',
            name='beat_obj',
            field=models.ForeignKey(to='common.Beat', null=True),
        ),
    ]
