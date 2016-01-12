from django.core.management.base import BaseCommand

from common.models import Allegation


class Command(BaseCommand):
    help = 'Get date only from incident date'

    def handle(self, *args, **options):
        for allegation in Allegation.objects.all()\
                .filter(incident_date_only=None):
            if allegation.incident_date:
                allegation.incident_date_only = allegation.incident_date.date()
                allegation.save()
