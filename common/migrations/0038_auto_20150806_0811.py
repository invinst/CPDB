# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re

from django.db import models, migrations


def add_comma_to_city(apps, schema_editor):
    allegation_model = apps.get_model('common', 'Allegation')
    pattern = re.compile("(.+) il", re.IGNORECASE)
    for allegation in allegation_model.objects.filter(city__icontains='il'):
        allegation.city = pattern.sub(r"\1, IL", allegation.city)
        allegation.save()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0037_merge'),
    ]

    operations = [
        migrations.RunPython(add_comma_to_city),
    ]

