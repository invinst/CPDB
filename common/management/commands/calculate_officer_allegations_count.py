from django.core.management.base import BaseCommand
from django.db.models import Count

from common.models import Officer


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        officers = Officer.objects.all().annotate(count=Count('allegation'))
        for officer in officers:
          officer.allegations_count = officer.count
          officer.save()