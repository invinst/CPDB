# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.db.models import F

from common.decorators import apply_with_progress_bar


def apply_changes(apps, schema_editor):
    PoliceUnit = apps.get_model('common', 'PoliceUnit')
    OfficerHistory = apps.get_model('common', 'OfficerHistory')
    Officer = apps.get_model('common', 'Officer')
    Investigator = apps.get_model('common', 'Investigator')

    @apply_with_progress_bar('creating PoliceUnit rows')
    def create_policeunit_rows(unit_name):
        unit = PoliceUnit.objects.create(unit_name=unit_name)
        OfficerHistory.objects.filter(unit=unit_name).update(unit_fk=unit)

    @apply_with_progress_bar('updating current unit for officers')
    def update_officers_unit(officer):
        current_unit = None
        try:
            if officer.officerhistory_set.exists():
                current_unit = officer.officerhistory_set.all().order_by('-end_date').first().unit_fk
            if officer.unit:
                current_unit = PoliceUnit.objects.get(unit_name=officer.unit)
        except (AttributeError, PoliceUnit.DoesNotExist):
            pass
        if not current_unit:
            return

        officer.unit_fk = current_unit
        officer.save()

    @apply_with_progress_bar('updating current unit for investigators')
    def update_investigators_unit(investigator):
        current_unit = None
        try:
            current_unit = PoliceUnit.objects.get(unit_name=investigator.unit)
        except (PoliceUnit.DoesNotExist):
            pass

        if not current_unit:
            return

        investigator.unit_fk = current_unit
        investigator.save()

    create_policeunit_rows(OfficerHistory.objects.all().values_list('unit', flat=True).distinct())
    update_officers_unit(Officer.objects.all())
    update_investigators_unit(Investigator.objects.all())


def revert_changes(apps, schema_editor):
    PoliceUnit = apps.get_model('common', 'PoliceUnit')
    OfficerHistory = apps.get_model('common', 'OfficerHistory')
    Officer = apps.get_model('common', 'Officer')
    Investigator = apps.get_model('common', 'Investigator')

    @apply_with_progress_bar(desc='revert unit data for officers')
    def revert_change_for_officers(officer):
        officer.unit = officer.unit_fk.unit_name
        officer.unit_fk = None
        officer.save()

    @apply_with_progress_bar(desc='revert unit data for officer history')
    def revert_change_for_officer_histories(oh):
        oh.unit = oh.unit_fk.unit_name
        oh.unit_fk = None
        oh.save()

    @apply_with_progress_bar(desc='revert unit data for investigators')
    def revert_change_for_investigators(investigator):
        investigator.unit = investigator.unit_fk.unit_name
        investigator.unit_fk = None
        investigator.save()

    revert_change_for_officers(Officer.objects.filter(unit_fk__isnull=False).distinct())
    revert_change_for_officer_histories(OfficerHistory.objects.filter(unit_fk__isnull=False).distinct())
    revert_change_for_investigators(Investigator.objects.filter(unit_fk__isnull=False).distinct())
    PoliceUnit.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0008_create_policeunit_table'),
    ]

    operations = [
        migrations.RunPython(apply_changes, revert_changes)
    ]
