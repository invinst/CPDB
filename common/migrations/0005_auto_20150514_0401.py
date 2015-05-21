# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def create_beat(apps, schema_editor):
  Beat = apps.get_model('common','Beat')
  Allegation = apps.get_model('common','Allegation')
  for allegation in Allegation.objects.all():
    if allegation.beat:
      try:
          beat = Beat.objects.get(name=allegation.beat)
      except:
          beat = Beat.objects.create(name=allegation.beat)
      allegation.beat_obj = beat
      allegation.save()

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0004_auto_20150514_0401'),
    ]

    operations = [
      migrations.RunPython(create_beat),
    ]
