# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0018_complaint'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='complainingwitness',
            name='crid',
        ),
        migrations.RemoveField(
            model_name='policewitness',
            name='crid',
        ),
        migrations.AddField(
            model_name='complainingwitness',
            name='complaint',
            field=models.ForeignKey(null=True, to='common.Complaint'),
        ),
        migrations.AddField(
            model_name='policewitness',
            name='complaint',
            field=models.ForeignKey(null=True, to='common.Complaint'),
        ),
    ]
