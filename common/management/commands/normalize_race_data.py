from django.core.management.base import BaseCommand
from common.models import Officer


OLD_EMPTY_RACE = 'Unknown'


class Command(BaseCommand):
    def handle(self, *args, **options):
        Officer.objects.filter(race=OLD_EMPTY_RACE).update(race='')
