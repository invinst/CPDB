from django.core.management.base import BaseCommand

from common.models import Allegation, OUTCOMES


class Command(BaseCommand):
    help = 'Correct allegation final outcome and final finding'

    def handle(self, *args, **options):
        Allegation.objects.filter(final_finding='su').update(final_finding='SU')
        Allegation.objects.filter(final_outcome='0').update(final_outcome='000')
        Allegation.objects.filter(final_outcome='15').update(final_outcome='015')
        Allegation.objects.filter(final_outcome='999').update(final_outcome=None)

        for outcome in Allegation.objects.all().distinct().values_list('final_outcome', flat=True):
            if outcome and len(outcome) < 3:
                update = outcome.zfill(3)
                Allegation.objects.filter(final_outcome=outcome).update(final_outcome=update)

