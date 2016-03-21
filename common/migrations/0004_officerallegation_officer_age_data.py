# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def calculate_officer_age(apps, schema_editor):
    OfficerAllegation = apps.get_model('common', 'OfficerAllegation')
    for oa in OfficerAllegation.objects.filter(
            allegation__incident_date_only__isnull=False, officer__birth_year__gt=0):
        try:
            oa.officer_age = oa.allegation.incident_date_only.year - oa.officer.birth_year
        except (AttributeError, TypeError):
            continue
        print('    %d' % oa.officer_age)
        oa.save()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_officerallegation_officer_age'),
    ]

    operations = [
        migrations.RunPython(calculate_officer_age)
    ]
