from django.core.management.base import BaseCommand
from common.models import Investigator

import csv

FIRST_NAME_COL = 1
LAST_NAME_COL = 0
CURRENT_REPORT_COL = 2
CURRENT_RANK_COL = 3


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
                'not_found': 0
            }
            for row in reader:
                name = "%s, %s" % (row[LAST_NAME_COL], row[FIRST_NAME_COL])
                try:
                    investigator = Investigator.objects.get(raw_name__iexact=name)
                    investigator.current_rank = row[CURRENT_RANK_COL]
                    investigator.current_report = row[CURRENT_REPORT_COL]
                    investigator.save()
                    counters['updated'] += 1
                except Investigator.DoesNotExist:
                    counters['not_found'] += 1
                except Exception as inst:
                    print(inst)

            print(counters)
