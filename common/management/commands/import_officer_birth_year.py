from django.core.management.base import BaseCommand
from common.models import Officer

import csv

NAME_COL = 0
YEAR_COL = 1


class Command(BaseCommand):
    help = 'Import csv data from CSV where data is:' \
           ' last name, first name, current report, current rank'

    def add_arguments(self, parser):
        parser.add_argument('--file')

    def handle(self, *args, **options):
        with open(options['file']) as f:
            reader = csv.reader(f)
            counters = {
                'updated': 0,
                'not_found': 0,
                'multiple': 0
            }
            for row in reader:
                names = [x.strip() for x in row[NAME_COL].split(",")]

                try:
                    officer = Officer.objects.get(officer_first__iexact=names[1],
                                                  officer_last__iexact=names[0])
                    try:
                        officer.birth_year = int(row[YEAR_COL])
                        officer.save()
                        counters['updated'] += 1
                    except ValueError:
                        pass
                except Officer.MultipleObjectsReturned:
                    counters['multiple'] += 1
                except Officer.DoesNotExist:
                    counters['not_found'] += 1
                except Exception as inst:
                    print(inst)

            print(counters)
