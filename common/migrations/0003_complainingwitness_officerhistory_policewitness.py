# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_auto_20150511_0419'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComplainingWitness',
            fields=[
                ('cwit_id', models.IntegerField(primary_key=True, serialize=False)),
                ('crid', models.CharField(null=True, max_length=30)),
                ('gender', models.CharField(null=True, max_length=1)),
                ('race', models.CharField(null=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='OfficerHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('unit', models.CharField(null=True, max_length=5)),
                ('rank', models.CharField(null=True, max_length=5)),
                ('star', models.FloatField(null=True)),
                ('as_of', models.DateField(null=True)),
                ('officer', models.ForeignKey(null=True, to='common.Officer')),
            ],
        ),
        migrations.CreateModel(
            name='PoliceWitness',
            fields=[
                ('pwit_id', models.IntegerField(primary_key=True, serialize=False)),
                ('crid', models.CharField(null=True, max_length=30)),
                ('gender', models.CharField(null=True, max_length=1)),
                ('race', models.CharField(null=True, max_length=50)),
                ('officer', models.ForeignKey(null=True, to='common.Officer')),
            ],
        ),
    ]
