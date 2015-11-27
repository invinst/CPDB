# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import csv
import os

from django.db import models, migrations
from django.conf import settings


def import_allegation_categories_from_csv(apps, schema_editor):
    AllegationCategory = apps.get_model('common','AllegationCategory')
    with open(os.path.join(settings.BASE_DIR, 'common/data/category.csv'), 'r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',', quotechar='"')
        for row in csv_reader:
            obj, created = AllegationCategory.objects.get_or_create(
                cat_id=row[0],
                defaults={
                    'allegation_name': row[1],
                    'category': row[2],
                    'on_duty': row[3] == 'ON',
                    'citizen': row[4] == 'CITIZEN'
                })



class Migration(migrations.Migration):

    dependencies = [
        ('common', '0046_auto_20151109_0945'),
    ]

    operations = [
        migrations.RunPython(import_allegation_categories_from_csv),
    ]
