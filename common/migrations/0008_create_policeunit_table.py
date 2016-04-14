# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0007_create_officerbadgenumber_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='PoliceUnit',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('unit_name', models.CharField(max_length=5)),
            ],
        ),
        migrations.AlterField(
            model_name='officer',
            name='rank',
            field=models.CharField(max_length=5, null=True, choices=[['FTO', 'Field Training Officer'], ['LT', 'Lieutenant'], ['ET', 'Evidence Technician'], ['DET', 'Detective'], ['PO', 'Police Officer'], ['Cpt', 'Captain'], ['SGT', 'Sergeant'], ['CMDR', 'Commander'], ['Agent', 'Police Agent'], ['Chief', 'Chief']], blank=True),
        ),
        migrations.AddField(
            model_name='officer',
            name='unit_fk',
            field=models.ForeignKey(null=True, to='common.PoliceUnit'),
        ),
        migrations.AddField(
            model_name='officerhistory',
            name='unit_fk',
            field=models.ForeignKey(null=True, to='common.PoliceUnit'),
        ),
    ]
