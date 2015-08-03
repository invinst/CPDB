# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RequestEmail',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('crid', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='requestemail',
            unique_together=set([('crid', 'email')]),
        ),
    ]
