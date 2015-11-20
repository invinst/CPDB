# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0007_session_active_tab'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='active_tab',
            field=models.CharField(max_length=40, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='session',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='session',
            name='ip',
            field=models.CharField(max_length=40, default='', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='session',
            name='share_count',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='session',
            name='share_from',
            field=models.ForeignKey(default=None, null=True, to='share.Session', blank=True),
        ),
        migrations.AlterField(
            model_name='session',
            name='title',
            field=models.CharField(max_length=255, blank=True),
        ),
        migrations.AlterField(
            model_name='session',
            name='user_agent',
            field=models.CharField(max_length=255, blank=True, null=True),
        ),
    ]
