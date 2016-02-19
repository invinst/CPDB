# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='setting',
            name='meta_description',
            field=models.CharField(max_length=255, default='\n    The Citizens Police Data Project stores a searchable database of police disciplinary information obtained from the City of Chicago.'),
        ),
        migrations.AddField(
            model_name='setting',
            name='meta_keywords',
            field=models.CharField(max_length=255, default='\n    Chicago Police Department, Citizens Police Data Project, Invisible Institute, Police, Allegations, Disciplines'),
        ),
    ]
