import csv

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.management.base import BaseCommand

from common.models import ComplainingWitness, PoliceWitness, Officer

CRID_COL = 4
NAME_COL = 2
GENDER_COL = 8
RACE_COL = 12
STAR_COL = 19


class Command(BaseCommand):
    counters = {
        'created': 0,
    }

    def add_arguments(self, parser):
        parser.add_argument('--file')
        parser.add_argument('--start-row')

    def get_officer(self, **kwargs):
        try:
            return Officer.objects.get(**kwargs)

        except Officer.DoesNotExist:
            if kwargs.get('star'):
                return Officer.objects.create(officer_first=kwargs['officer_first__iexact'],
                                              officer_last=kwargs['officer_last__iexact'],
                                              star=kwargs['star'])

            else:
                return None

        except MultipleObjectsReturned:
            print(kwargs)
            return None

    def handle(self, *args, **options):
        if not options.get('start_row',"").isnumeric():
            print("You must supply a start row, ex: --start-row 15")
            return

        start_row = int(options['start_row']) -1

        with open(options['file']) as f:
            reader = csv.reader(f)

            counter = 0
            for row in reader:
                if counter < start_row:
                    counter += 1
                    continue
                counter += 1
                if row[CRID_COL]:
                    crid = row[CRID_COL]

                if row[NAME_COL]:
                    gender = row[GENDER_COL]
                    name = row[NAME_COL]
                    try:
                        star = int(row[STAR_COL])
                    except ValueError:
                        star = None
                    race = row[RACE_COL]

                    splitted = name.split(",")
                    officer = None
                    if len(splitted) > 1:


                        officer = self.get_officer(
                            officer_first__iexact=splitted[1].strip(),
                            officer_last__iexact=splitted[0].strip(),
                            star=star
                        )

                    PoliceWitness.objects.create(crid=crid,
                                                 gender=gender,
                                                 officer=officer,
                                                 race=race,
                                                 )
                    self.counters['created'] += 1
        print(self.counters)
