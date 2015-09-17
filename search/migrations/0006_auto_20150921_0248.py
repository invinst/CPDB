# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0005_merge'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='alias',
            unique_together=set([('alias', 'target')]),
        ),
    ]
