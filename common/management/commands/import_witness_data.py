from django.core.management.base import BaseCommand
from common.models import ComplainingWitness, PoliceWitness


import csv


class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        parser.add_argument('--file')
        parser.add_argument('--type')

    def handle(self, *args, **options):
        models = {'police': PoliceWitness, 'complaint': ComplainingWitness}
        with open(options['file']) as f:
            reader = csv.reader(f)
            m = models[options['type']]
            x = 0
            create = []
            for row in reader:
                if x == 0:
                    x += 1
                    continue
                try:
                    new_model = m(pk=row[0], crid=row[1], gender=row[2], race=row[3])
                    if options['type'] == 'police':
                        new_model.officer_id = row[4]
                    create.append(new_model)
                except Exception as inst:
                    print(inst)
                    print(row)
                    print("CRID: %s" % row[1])
                    pass

            m.objects.bulk_create(create)

