# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import csv

from django.db import models, migrations

def import_investigator_rank(apps, schema_editor):
    Investigator = apps.get_model('common', 'Investigator')
    rank_file = csv.reader(open('common/migrations/investigator_rank.csv'))

    for row in rank_file:

        investigators = Investigator.objects.filter(raw_name=row[1])
        if investigators.exists():
            investigator = investigators.first()
            investigator.current_rank = row[2]
            if 'IPRA' in row[2].upper():
                investigator.agency = 'IPRA'
            investigator.save()


def do_nothing(*args):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0069_investigator_agency'),
    ]

    operations = [
        migrations.RunPython(import_investigator_rank, do_nothing)
    ]
