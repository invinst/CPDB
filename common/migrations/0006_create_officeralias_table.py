# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0005_remove_document_fields_from_allegation'),
    ]

    operations = [
        migrations.CreateModel(
            name='OfficerAlias',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('old_officer_id', models.IntegerField()),
                ('new_officer', models.ForeignKey(to='common.Officer')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='officeralias',
            unique_together=set([('old_officer_id', 'new_officer')]),
        ),
    ]
