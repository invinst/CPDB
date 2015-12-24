# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import csv
from django.core import management

from django.db import models, migrations
from django.db.models.query_utils import Q

from common.constants import FOIA_START_DATE

def update_categories(apps, schema_editor):
    Allegation = apps.get_model('common', 'Allegation')
    AllegationCategory = apps.get_model('common', 'AllegationCategory')
    with open("common/migrations/updated_categories.csv") as f:
        csv_reader = csv.reader(f)
        next(csv_reader)
        next(csv_reader)
        for row in csv_reader:
            if row[1] != row[4]:
                current_allegation = AllegationCategory.objects.get(cat_id=row[3])
                new_allegation = AllegationCategory.objects.create(
                    category=current_allegation.category,
                    allegation_name=row[1],
                    cat_id=row[0]
                )
                q = Q(incident_date__lt=FOIA_START_DATE) | Q(start_date__lt=FOIA_START_DATE)
                to_update = Allegation.objects.filter(
                    q,
                    cat=current_allegation
                )
                print(row[0], "created and reset #", to_update.count())
                to_update.update(cat=new_allegation)

        print("Updating category allegation counts")
        management.call_command('calculate_allegations_count')

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0060_auto_20151222_0816'),
    ]

    operations = [
        migrations.RunPython(update_categories)
    ]
