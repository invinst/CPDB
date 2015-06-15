# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def add_crid(apps, schema_editor):
    PoliceWitness = apps.get_model('common', 'PoliceWitness')
    ComplainingWitness = apps.get_model('common', 'ComplainingWitness')

    for police_witness in PoliceWitness.objects.all():
        police_witness.crid = police_witness.complaint.crid
        police_witness.save()

    for complaint_witness in ComplainingWitness.objects.all():
        complaint_witness.crid = complaint_witness.complaint.crid
        complaint_witness.save()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0028_auto_20150615_0915'),
    ]

    operations = [
        migrations.RunPython(add_crid)
    ]
