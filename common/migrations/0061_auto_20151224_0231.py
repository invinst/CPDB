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
    moore_crids = []
    with open("common/migrations/moore_crids.csv") as f:
        for row in csv.reader(f):
            moore_crids.append(row[0])
        Allegation.objects.filter(crid__in=moore_crids).update(source='moore')
    with open("common/migrations/updated_categories.csv") as f:
        csv_reader = csv.reader(f)
        next(csv_reader)
        next(csv_reader)
        for row in csv_reader:
            if row[1].lower() != row[4].lower():
                try:
                    current_allegation = AllegationCategory.objects.get(cat_id=row[3])
                except AllegationCategory.DoesNotExist:
                    continue
                new_allegation = AllegationCategory.objects.create(
                    category=current_allegation.category,
                    allegation_name=row[1],
                    cat_id=row[0]
                )

                to_update = Allegation.objects.filter(
                    source='moore',
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
        migrations.AddField(
            model_name='allegation',
            name='source',
            field=models.CharField(null=True, max_length=20),
        ),
        migrations.RunPython(update_categories)
    ]
