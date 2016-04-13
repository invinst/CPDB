# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0006_create_officeralias_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='OfficerBadgeNumber',
            fields=
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('star', models.CharField(max_length=10)),
                ('current', models.BooleanField(default=False)),
                ('officer', models.ForeignKey(to='common.Officer', null=True)),
            ],
        ),
        migrations.RenameField(
            model_name='officerhistory',
            old_name='as_of',
            new_name='effective_date',
        ),
        migrations.AddField(
            model_name='officerhistory',
            name='end_date',
            field=models.DateField(null=True),
        ),
    ]
