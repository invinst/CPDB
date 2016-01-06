# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def insert_data_to_officerallegation(apps, schema_editor):
    Allegation = apps.get_model('common', 'Allegation')
    OfficerAllegation = apps.get_model('common', 'OfficerAllegation')

    crids = list(set(filter(
        None, Allegation.objects.all().values_list('crid', flat=True))))

    # len_crids = len(crids)
    # processed_crids = 0

    for crid in crids:
        # processed_crids += 1
        # print('%d / %d' % (processed_crids, len_crids))
        allegations = Allegation.objects.filter(crid=crid)
        allegation_to_keep = allegations[0]
        remaining_allegations = allegations[1:]

        for allegation in allegations:
            officer_allegation = OfficerAllegation(
                officer=allegation.officer,
                cat=allegation.cat,
                allegation=allegation_to_keep,
                recc_finding=allegation.recc_finding,
                recc_outcome=allegation.recc_outcome,
                final_finding=allegation.final_finding,
                final_outcome=allegation.final_outcome,
                final_outcome_class=allegation.final_outcome_class,
                start_date=allegation.start_date,
                end_date=allegation.end_date)
            officer_allegation.save()

        # fix areas data in case it's empty
        if not allegation_to_keep.areas.all().count():
            area_lists = list(filter(None, [
                [area for area in allegation.areas.all()]
                for allegation in allegations]))
            if area_lists:
                allegation_to_keep.areas.add(*area_lists[0])

        for allegation in remaining_allegations:
            allegation.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0064_officerallegation'),
    ]

    operations = [
        migrations.RunPython(insert_data_to_officerallegation)
    ]
