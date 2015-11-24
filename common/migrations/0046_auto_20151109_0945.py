# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations



class Migration(migrations.Migration):

    dependencies = [
        ('common', '0045_auto_20151027_0851'),
    ]


    operations = [
        migrations.AddField(
            model_name='allegationcategory',
            name='citizen',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='allegationcategory',
            name='on_duty',
            field=models.BooleanField(default=False),
        ),
    ]


