# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import csv

from django.db import models, migrations
from django.db.models import Count


def calculate_allegations_count(apps):
    Officer = apps.get_model('common', 'Officer')
    AllegationCategory = apps.get_model('common', 'AllegationCategory')
    Allegation = apps.get_model('common', 'Allegation')

    officers = Officer.objects.all().annotate(
        count=Count('allegation'))

    for officer in officers:
        officer.allegations_count = officer.count
        officer.discipline_count = officer.allegation_set\
            .filter(final_outcome_class='disciplined').count()
        officer.save()

    for allegation_cat in AllegationCategory.objects.all():
        allegation_cat.allegations_count = \
            allegation_cat.allegation_set.count()
        allegation_cat.category_count = Allegation.objects.filter(
            cat__category=allegation_cat.category).count()
        allegation_cat.save()


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
                    current_allegation = AllegationCategory.objects.get(
                        cat_id=row[3])
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
                to_update.update(cat=new_allegation)

        calculate_allegations_count(apps)

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0062_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='allegation',
            name='source',
            field=models.CharField(null=True, max_length=20),
        ),
        migrations.RunPython(update_categories)
    ]
