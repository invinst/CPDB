# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def update_complainingwitness_allegation_foreign_key(apps, schema_editor):
    ComplainingWitness = apps.get_model('common', 'ComplainingWitness')
    Allegation = apps.get_model('common', 'Allegation')

    for witness in ComplainingWitness.objects.all():
        try:
            witness.allegation = Allegation.objects.get(crid=witness.crid)
            witness.save()
        except Allegation.DoesNotExist:
            pass


def update_policewitness_allegation_foreign_key(apps, schema_editor):
    PoliceWitness = apps.get_model('common', 'PoliceWitness')
    Allegation = apps.get_model('common', 'Allegation')

    for witness in PoliceWitness.objects.all():
        try:
            witness.allegation = Allegation.objects.get(crid=witness.crid)
            witness.save()
        except Allegation.DoesNotExist:
            pass


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0067_add_allegation_foreign_key_to_complainingwitness_and_policewitness'),
    ]

    operations = [
        migrations.RunPython(update_complainingwitness_allegation_foreign_key),
        migrations.RunPython(update_policewitness_allegation_foreign_key)
    ]
