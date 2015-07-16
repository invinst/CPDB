import os
import csv
from django.contrib.gis.utils.layermapping import LayerMapping

from django.core.management.base import BaseCommand
from common.models import Area, Allegation

class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        parser.add_argument('--file')
        parser.add_argument('--shapefile')

    def handle(self, *args, **options):
        mapping = {'name': 'BEAT_NUM', 'polygon': 'POLYGON'}
        lm = LayerMapping(Area, options['shapefile'], mapping)
        lm.save()
        Area.objects.filter(type="").update(type="new_beat")

        for allegation in Allegation.objects.filter(areas__type='beat'):
            allegation.areas.filter(type='beat').delete()
            allegation.save()
        Area.objects.filter(type="beat").delete()
        Area.objects.filter(type="new_beat").update(type="beat")

        with open(options['file']) as f:
            c = csv.reader(f)
            BEAT_COL = 9
            success = 0
            fail = 0
            for row in c:
                try:
                    allegation = Allegation.objects.get(pk=row[0])
                    if not allegation.beat:
                        beat_name = row[BEAT_COL]
                        if len(beat_name) < 4:
                            beat_name = beat_name.zfill(4)
                        beat = Area.objects.get(name=beat_name,type='beat')
                        allegation.areas.add(beat)
                        allegation.save()
                        success += 1
                except:
                    fail += 1
            print("success: %s fails: %s" % (success, fail))



