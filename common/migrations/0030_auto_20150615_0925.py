# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0029_auto_20150615_0915'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='complaint',
            name='areas',
        ),
        migrations.RemoveField(
            model_name='complaint',
            name='cat',
        ),
        migrations.RemoveField(
            model_name='complaint',
            name='investigator',
        ),
        migrations.RemoveField(
            model_name='complaint',
            name='officers',
        ),
        migrations.RemoveField(
            model_name='complainingwitness',
            name='complaint',
        ),
        migrations.RemoveField(
            model_name='policewitness',
            name='complaint',
        ),
        migrations.DeleteModel(
            name='Complaint',
        ),
    ]
