from django.core.management.base import BaseCommand

from common.models import (
    OfficerAllegation, NO_DISCIPLINE_CODES, DISCIPLINE_CODES)


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        for officer_allegation in OfficerAllegation.objects.all():
            if officer_allegation.final_finding == 'SU':
                if officer_allegation.final_outcome in DISCIPLINE_CODES:
                    officer_allegation.final_outcome_class = 'disciplined'
                else:
                    officer_allegation.final_outcome_class = 'sustained'
            elif officer_allegation.final_outcome and \
                    officer_allegation.final_outcome in NO_DISCIPLINE_CODES:
                officer_allegation.final_outcome_class = "not-sustained"

            else:
                if officer_allegation.final_finding in [
                        'NS', 'UN', 'EX', 'DS', 'NA', 'NC']:
                    officer_allegation.final_outcome_class = 'not-sustained'
                else:
                    officer_allegation.final_outcome_class = \
                        'open-investigation'

            officer_allegation.save()
