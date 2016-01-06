# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0066_remove_fields_from_allegation'),
    ]

    operations = [
        migrations.AddField(
            model_name='complainingwitness',
            name='allegation',
            field=models.ForeignKey(to='common.Allegation', null=True),
        ),
        migrations.AddField(
            model_name='policewitness',
            name='allegation',
            field=models.ForeignKey(to='common.Allegation', null=True),
        ),
    ]
