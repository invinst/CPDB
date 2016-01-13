from django.core.management.base import BaseCommand
from django.db.models import Count

from common.models import (
    Allegation, Investigator, DISCIPLINE_CODES, OfficerAllegation)


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        Allegation.objects.all().update(investigator=None)

        values = Allegation.objects.values('investigator_name')\
            .annotate(dcount=Count('*'))
        for value in values:
            if value['investigator_name']:
                raw_name = value['investigator_name']
                name = [x.strip() for x in raw_name.split(',')]
                name = "%s %s" % (name[1].capitalize(), name[0].capitalize())
                try:
                    investigator = Investigator.objects.get(raw_name=raw_name)
                    investigator.complaint_count = value['dcount']
                    investigator.name = name
                    investigator.save()
                except Investigator.DoesNotExist:
                    investigator = Investigator.objects.create(
                        raw_name=raw_name,
                        name=name,
                        complaint_count=value['dcount'])
                allegations = Allegation.objects.filter(
                    investigator_name=raw_name)
                allegations.update(investigator=investigator)
                investigator.discipline_count = \
                    OfficerAllegation.objects.filter(
                        allegation__in=allegations,
                        final_outcome__in=DISCIPLINE_CODES).count()
                investigator.save()
