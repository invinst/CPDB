# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re

from django.db import models, migrations


def uppercase_il(apps, schema_editor):
    allegation_model = apps.get_model('common','Allegation')
    pattern = re.compile(" il", re.IGNORECASE)
    for allegation in allegation_model.objects.filter(city__icontains=' il'):
        allegation.city = pattern.sub(" IL", allegation.city)
        #print(allegation.city)
        allegation.save()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0034_allegation_document_requested'),
    ]

    operations = [
      migrations.RunPython(uppercase_il),
    ]
