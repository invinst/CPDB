from django.core.management.base import BaseCommand

from common.models import Allegation


class Command(BaseCommand):
    help = 'Correct allegation final outcome and final finding'

    def handle(self, *args, **options):
        Allegation.objects.filter(final_finding='su').update(final_finding='SU')
        Allegation.objects.filter(final_outcome='0').update(final_outcome='000')
        Allegation.objects.filter(final_outcome='15').update(final_outcome='015')
        Allegation.objects.filter(final_outcome='999').update(final_outcome=None)
