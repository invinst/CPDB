from django.core.management.base import BaseCommand

from common.models import OfficerAllegation


class Command(BaseCommand):
    help = 'Correct allegation final outcome and final finding'

    def handle(self, *args, **options):
        OfficerAllegation.objects.filter(final_finding='su')\
            .update(final_finding='SU')
        OfficerAllegation.objects.filter(final_outcome='0')\
            .update(final_outcome='000')
        OfficerAllegation.objects.filter(final_outcome='15')\
            .update(final_outcome='015')
        OfficerAllegation.objects.filter(final_outcome='999')\
            .update(final_outcome=None)

        for outcome in OfficerAllegation.objects.all().distinct()\
                .values_list('final_outcome', flat=True):
            if outcome and len(outcome) < 3:
                update = outcome.zfill(3)
                OfficerAllegation.objects.filter(final_outcome=outcome)\
                    .update(final_outcome=update)
