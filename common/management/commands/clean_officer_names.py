from django.core.management.base import BaseCommand
from django.db.models import F

from common.models import Officer


class Command(BaseCommand):
    help = 'Clean Officer Names'


    def handle(self, *args, **options):
        for officer in Officer.objects.filter():
            if officer.officer_first:
                officer.officer_first = officer.officer_first.capitalize()
            if officer.officer_last:
                officer.officer_last = officer.officer_last.capitalize()
            officer.save()

        to_clean = [
            [' jr', ' Jr'],
            [' iv', ' IV'],
            [' iii', ' III'],
            [' ii', ' II'],
            [' sr', ' Sr'],
        ]

        for clean in to_clean:
            for officer in Officer.objects.filter(officer_last__endswith=clean[0]):
                officer.officer_last = officer.officer_last.replace(clean[0], clean[1])
                officer.save()



