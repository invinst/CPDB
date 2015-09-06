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

    def get_witness(self, **kwargs):
        try:
            return ComplainingWitness.objects.get(**kwargs)
        except ComplainingWitness.DoesNotExist:
            self.counters['not_found'] += 1
            return False
        except ComplainingWitness.MultipleObjectsReturned:
            self.counters['multiple'] += 1
            return False

    def handle(self, *args, **options):
        with open(options['file']) as f:
            reader = csv.reader(f)

            crid = False
            for row in reader:
                if self.counters['row'] % 3 == 1:
                    crid = row[CRID_COL]
                if self.counters['row'] % 3 == 2:
                    gender = row[GENDER_COL]
                    race = row[RACE_COL]
                    age = row[AGE_COL] or 0
                witness = False
                if self.counters['row'] % 3 == 0 and crid:
                    try:
                        witness = self.get_witness(crid=crid, race=race)
                        if not witness:
                            witness = self.get_witness(crid=crid)
                    finally:
                        if witness:
                            witness.race = race
                            try:
                                witness.age = int(age)
                            except ValueError:
                                witness.age = 0

                            witness.gender = gender
                            witness.save()
                            self.counters['updated'] += 1
                self.counters['row'] += 1
            print(self.counters)
