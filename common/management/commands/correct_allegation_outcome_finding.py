from django.core.management.base import BaseCommand

from common.models import Allegation, OUTCOMES


class Command(BaseCommand):
    help = 'Correct allegation final outcome and final finding'

    def handle(self, *args, **options):
        Allegation.objects.filter(final_finding='su').update(final_finding='SU')
        Allegation.objects.filter(final_outcome='0').update(final_outcome='000')
        Allegation.objects.filter(final_outcome='15').update(final_outcome='015')
        Allegation.objects.filter(final_outcome='999').update(final_outcome=None)

        for outcome in OUTCOMES:
            if outcome[0] and len(outcome[0]) < 3:
                update = outcome[0].zfill(3)
                Allegation.objects.filter(final_outcome=outcome[0]).update(final_outcome=update)
