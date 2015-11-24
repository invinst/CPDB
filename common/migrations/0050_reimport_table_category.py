# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import csv
import os
import re

from django.db import models, migrations
from django.conf import settings


def import_allegation_categories_from_csv(apps, schema_editor):
    AllegationCategory = apps.get_model('common','AllegationCategory')

    with open(os.path.join(settings.BASE_DIR, 'common/data/category.csv'), 'r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',', quotechar='"')

        callback = lambda word: "%s%s" % (word.group(1)[:1], word.group(1)[1:].lower())

        for row in csv_reader:
            attributes = {
                'allegation_name': re.sub(r'([A-Z]+)', callback, row[1]),
                'category': row[2],
                'on_duty': row[3] == 'ON',
                'citizen_dept': row[4].lower()
            }

            AllegationCategory.objects.update_or_create(cat_id=row[0], defaults=attributes)


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0049_alter_column_citizen_table_category'),
    ]

    operations = [
        migrations.RunPython(import_allegation_categories_from_csv),
    ]
