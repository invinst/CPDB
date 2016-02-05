# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0072_auto_20160119_0516'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentCrawler',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('num_documents', models.IntegerField()),
            ],
        ),
        migrations.AlterField(
            model_name='investigator',
            name='unit',
            field=models.CharField(null=True, max_length=50),
        ),
    ]
