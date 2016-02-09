# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitterbot', '0004_twitterresponse_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='response',
            name='type',
            field=models.CharField(choices=[['officer', 'officer'], ['investigator', 'investigator']], max_length=20),
        ),
    ]
