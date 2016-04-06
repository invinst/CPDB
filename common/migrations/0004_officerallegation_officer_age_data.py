# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

from tqdm import tqdm


def calculate_officer_age(apps, schema_editor):
    OfficerAllegation = apps.get_model('common', 'OfficerAllegation')

    oas = OfficerAllegation.objects.filter(
        allegation__incident_date_only__isnull=False, officer__birth_year__gt=0)

    total_rows = oas.count()
    pbar = tqdm(total=total_rows)
    num_calculated = 0

    for oa in oas:
        try:
            oa.officer_age = oa.allegation.incident_date_only.year - oa.officer.birth_year
            num_calculated += 1
        except (AttributeError, TypeError):
            continue
        oa.save()

        pbar.update()
        pbar.set_description('  Processed %d officer allegations' % num_calculated)

    pbar.close()
    print('  Processed %d officer allegations' % num_calculated)


def nullify_officer_age(apps, schema_editor):
    OfficerAllegation = apps.get_model('common', 'OfficerAllegation')

    oas = OfficerAllegation.objects.filter(officer_age__isnull=False)

    total_rows = oas.count()
    pbar = tqdm(total=total_rows)
    num_iterated = 0

    for oa in oas:
        oa.officer_age = None
        oa.save()

        num_iterated += 1
        pbar.update()
        pbar.set_description('  Processed %d rows' % num_iterated)

    pbar.close()
    print('  Processed %d rows' % num_iterated)


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_officerallegation_officer_age'),
    ]

    operations = [
        migrations.RunPython(calculate_officer_age, nullify_officer_age)
    ]
