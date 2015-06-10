# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0018_complaint'),
    ]

    operations = [
        migrations.CreateModel(
            name='Investigator',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=160)),
                ('complaint_count', models.IntegerField(default=0)),
            ],
        ),
    ]
