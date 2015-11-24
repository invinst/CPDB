import csv
from django.contrib.gis.utils.layermapping import LayerMapping

from django.core.management.base import BaseCommand
from common.models import Area, Allegation

BEAT_COL = 9


class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        parser.add_argument('--file')

    def handle(self, *args, **options):

        with open(options['file']) as f:
            c = csv.reader(f)

            success = 0
            fail = 0
            for row in c:
                try:
                    allegation = Allegation.objects.get(pk=row[0])
                    if not allegation.beat:
                        beat_name = row[BEAT_COL]
                        if len(beat_name) < 4:
                            beat_name = beat_name.zfill(4)
                        print(beat_name)
                        beat = Area.objects.get(name=beat_name, type='police-beats')
                        allegation.beat = beat
                        allegation.areas.add(beat)
                        allegation.save()
                        success += 1
                except Area.DoesNotExist:
                    fail += 1
            print("success: %s fails: %s" % (success, fail))



