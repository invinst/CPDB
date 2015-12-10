import csv
from django.contrib.gis.utils.layermapping import LayerMapping

from django.core.management.base import BaseCommand
from common.models import Area, Allegation

BEAT_COL = 14
CRID_COL = 1


class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        parser.add_argument('--file')

    def handle(self, *args, **options):

        with open(options['file']) as f:
            c = csv.reader(f)

            success = 0
            fail = 0
            duplicated_beat = Area.objects.filter(name='3100', type='police-beats')
            if duplicated_beat.count() > 1:
                duplicated_beat.first().delete()
            for row in c:
                try:

                    allegations = Allegation.objects.filter(crid=row[CRID_COL])
                    for allegation in allegations:

                        if not allegation.beat:
                            beat_name = row[BEAT_COL]

                            if len(beat_name) < 4:
                                beat_name = beat_name.zfill(4)
                            beat = Area.objects.get(name=beat_name, type='police-beats')
                            allegation.beat = beat
                            allegation.areas.add(beat)

                            if not allegation.point:
                                allegation.point = beat.centroid

                            allegation.save()
                            success += 1
                except Area.DoesNotExist:
                    fail += 1
                    print(beat_name)
                except Area.MultipleObjectsReturned:
                    print(beat_name)
                    fail += 1
            print("success: %s fails: %s" % (success, fail))

