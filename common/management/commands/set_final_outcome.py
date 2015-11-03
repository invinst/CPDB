from django.core.management.base import BaseCommand

from common.models import Allegation, NO_DISCIPLINE_CODES, DISCIPLINE_CODES


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        for allegation in Allegation.objects.all():
            if allegation.final_outcome and allegation.final_outcome in NO_DISCIPLINE_CODES:
                allegation.final_outcome_class = "not-sustained"
            elif allegation.final_finding == 'SU':
                if allegation.final_outcome in DISCIPLINE_CODES:
                    allegation.final_outcome_class = 'disciplined'
                else:
                    allegation.final_outcome_class = 'sustained'
            else:
                allegation.final_outcome_class = 'open-investigation'

            allegation.save()
