from django.core.management.base import BaseCommand
from common.models import ComplainingWitness

import csv

CRID_COL = 0
GENDER_COL = 1
RACE_COL = 3
AGE_COL = 2


class Command(BaseCommand):
    help = 'Import csv data from CSV where data is:' \
           ' last name, first name, current report, current rank'
    counters = {
        'updated': 0,
        'not_found': 0,
        'row': 1,
        'errors': 0,
        'multiple': 0
    }
    def add_arguments(self, parser):
        parser.add_argument('--file')



    def handle(self, *args, **options):
        with open(options['file']) as f:
            reader = csv.reader(f)
            ComplainingWitness.objects.all().delete()

            for row in reader:
                if self.counters['row'] % 3 == 1:
                    crid = row[CRID_COL]
                if self.counters['row'] % 3 == 2:
                    gender = row[GENDER_COL]
                    race = row[RACE_COL]
                    try:
                        age = int(row[AGE_COL])
                    except ValueError:
                        age = None

                if self.counters['row'] % 3 == 0 and crid:
                    ComplainingWitness.objects.create(
                        crid=crid,
                        race=race,
                        age=age,
                        gender=gender
                    )

                    self.counters['updated'] += 1
                self.counters['row'] += 1
            print(self.counters)
