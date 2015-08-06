# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0002_filterlog_num_allegations'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filterlog',
            name='query',
            field=models.TextField(),
        ),
    ]
