# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('search', '0013_sessionalias'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sessionalias',
            options={'verbose_name_plural': 'aliases'},
        ),
        migrations.AddField(
            model_name='sessionalias',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, default=1),
        ),
    ]
