import csv

from django.core.management.base import BaseCommand

from common.models import ComplainingWitness

CRID_COL = 1
GENDER_COL = 4
RACE_COL = 12
AGE_COL = 9


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
            encountered_crid = False

            for row in reader:
                if len(row[CRID_COL]):
                    try:
                        crid = int(row[CRID_COL])

                    except ValueError:
                        crid = False

                    if crid:
                        encountered_crid = True

                if not encountered_crid:
                    continue

                if row[GENDER_COL] or row[RACE_COL] or row[AGE_COL]:
                    gender = row[GENDER_COL]
                    race = row[RACE_COL]
                    try:
                        age = int(row[AGE_COL])
                    except ValueError:
                        age = None

                    if crid:
                        ComplainingWitness.objects.create(
                            crid=crid,
                            race=race,
                            age=age,
                            gender=gender
                        )

                    self.counters['updated'] += 1
                self.counters['row'] += 1

            print(self.counters)
