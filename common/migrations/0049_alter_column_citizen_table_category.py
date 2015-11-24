# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0047_auto_20151109_1015'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='allegationcategory',
            name='citizen',
        ),
        migrations.AddField(
            model_name='allegationcategory',
            name='citizen_dept',
            field=models.CharField(max_length=50, default='citizen', choices=[('citizen', 'Citizen'), ('dept', 'Dept'), ('?', 'Unknown')]),
        ),
    ]
