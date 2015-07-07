import os
import csv

from django.core.management.base import BaseCommand
from common.models import Area, Allegation

class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        parser.add_argument('--file')

    def handle(self, *args, **options):
        with open(options['file']) as f:
            c = csv.reader(f)
            BEAT_COL = 9
            for row in c:
                try:
                    allegation = Allegation.objects.get(pk=row[0])
                    if not allegation.beat:
                        beat = Area.objects.get(extra3="%s" % row[BEAT_COL],type='new_beat')
                        allegation.areas.add(beat)
                        allegation.save()
                except Exception as inst:
                    print(inst)
                    print(row[BEAT_COL])

