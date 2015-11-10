import csv

from django.core.management.base import BaseCommand
from common.models import AllegationCategory

CAT_ID = 0
CAT_NAME = 1


class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        parser.add_argument('--file')

    def handle(self, *args, **options):
        counters = {
            'updated': 0,
            'not_exist': 0,
        }
        with open(options['file']) as f:
            reader = csv.reader(f)

            for row in reader:
                if not row[CAT_NAME] or not row[CAT_ID]:
                    continue

                try:
                    category = AllegationCategory.objects.get(cat_id=row[CAT_ID])
                    category.allegation_name = row[CAT_NAME].title()
                    category.save()
                    counters['updated'] += 1

                except AllegationCategory.DoesNotExist:
                    counters['not_exist'] += 1
                    continue

        print(counters)
