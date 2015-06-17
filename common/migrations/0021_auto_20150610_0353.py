# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def investigator_copy(apps, schema_editor):
    complaint_model = apps.get_model('common', 'complaint')
    investigator_model = apps.get_model('common', 'investigator')
    values = complaint_model.objects.values('investigator_name').annotate(dcount=models.Count('*'))
    for value in values:
        if value['investigator_name']:
            investigator_model.objects.create(name=value['investigator_name'], complaint_count=value['dcount'])


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0020_auto_20150610_0353'),
    ]

    operations = [
        migrations.RunPython(investigator_copy)
    ]
