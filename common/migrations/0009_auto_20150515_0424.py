# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def create_areas(apps, schema_editor):
  Beat = apps.get_model('common','Beat')
  Neighborhood = apps.get_model('common','Neighborhood')
  Area = apps.get_model('common','Area')
  for beat in Beat.objects.all():
    area = Area.objects.create(name=beat.name,polygon=beat.polygon,type='beat')
    for allegation in beat.allegation_set.all():
      allegation.areas.add(area)


  for neighborhood in Neighborhood.objects.all():
    area = Area.objects.create(name=beat.name,polygon=beat.polygon,type='neighborhood')
    for allegation in neighborhood.allegation_set.all():
      allegation.areas.add(area)



class Migration(migrations.Migration):

    dependencies = [
        ('common', '0008_auto_20150515_0421'),
    ]

    operations = [
      migrations.RunPython(create_areas),
    ]
