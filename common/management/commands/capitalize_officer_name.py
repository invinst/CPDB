from django.core.management.base import BaseCommand

from common.models import Officer


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        for officer in Officer.objects.all():
            officer.officer_first = officer.officer_first.capitalize()
            officer.officer_last = officer.officer_last.capitalize()
            officer.save()
        print("Done\n")
