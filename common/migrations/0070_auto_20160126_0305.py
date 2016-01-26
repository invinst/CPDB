# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import csv

from django.db import models, migrations


def set_investigators(apps, schema_editor):
    Allegation = apps.get_model('common', 'allegation')
    Investigator = apps.get_model('common', 'investigator')

    allegation_reader = csv.reader(open('common/migrations/allegations_wudi.csv'))
    investigator_reader = csv.reader(open('common/migrations/investigators_wudi.csv'))

    investigator_map = {}
    next(investigator_reader)
    for row in investigator_reader:
        try:
            investigator = Investigator.objects.get(raw_name=row[1])

        except Investigator.DoesNotExist:
            print(row, "Does not exist, creating")
            investigator = Investigator(raw_name=row[1])
            splitted = row[1].split(",")
            investigator.name = "{first} {last}".format(first=splitted[1].capitalize(), last=splitted[0].capitalize())

        investigator.current_rank = row[2]
        investigator.unit = row[3]
        investigator.save()
        investigator_map[row[0]] = investigator

    next(allegation_reader)
    for row in allegation_reader:
        if not row[1]:
            continue
        try:
            allegation = Allegation.objects.get(crid=row[0])
        except Allegation.DoesNotExist:
            print(row, "Does not exist")
            continue

        if row[1] in investigator_map:
            allegation.investigator = investigator_map[row[1]]
            allegation.save()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0069_add_timestamp_fields'),
    ]

    operations = [
        migrations.RunPython(set_investigators)
    ]
