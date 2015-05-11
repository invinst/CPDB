# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Allegation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('record_id', models.IntegerField(null=True)),
                ('crid', models.CharField(null=True, max_length=30)),
                ('recc_finding', models.CharField(null=True, max_length=255)),
                ('recc_outcome', models.CharField(null=True, max_length=5)),
                ('final_finding', models.CharField(null=True, max_length=255)),
                ('final_outcome', models.CharField(null=True, max_length=5)),
                ('beat', models.CharField(null=True, max_length=4)),
                ('location', models.CharField(null=True, max_length=20)),
                ('add1', models.IntegerField(null=True)),
                ('add2', models.CharField(null=True, max_length=255)),
                ('city', models.CharField(null=True, max_length=255)),
                ('incident_date', models.DateTimeField(null=True)),
                ('start_date', models.DateField(null=True)),
                ('end_date', models.DateField(null=True)),
                ('investigator', models.CharField(null=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='AllegationCategory',
            fields=[
                ('cat_id', models.CharField(primary_key=True, serialize=False, max_length=255)),
                ('category', models.CharField(null=True, max_length=255)),
                ('allegation_name', models.CharField(null=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Officer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('officer_first', models.CharField(null=True, max_length=255)),
                ('officer_last', models.CharField(null=True, max_length=255)),
                ('gender', models.CharField(null=True, max_length=1)),
                ('race', models.CharField(null=True, max_length=50)),
                ('appt_date', models.DateField(null=True)),
                ('unit', models.CharField(null=True, max_length=5)),
                ('rank', models.CharField(null=True, max_length=5)),
                ('star', models.FloatField(null=True)),
            ],
        ),
        migrations.AddField(
            model_name='allegation',
            name='cat',
            field=models.ForeignKey(null=True, to='common.AllegationCategory'),
        ),
        migrations.AddField(
            model_name='allegation',
            name='officer',
            field=models.ForeignKey(null=True, to='common.Officer'),
        ),
    ]
