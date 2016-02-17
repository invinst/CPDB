from django.core.management.base import BaseCommand
from django.db.models import Count

from common.models import Officer, AllegationCategory, OfficerAllegation


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        officers = Officer.objects.all().annotate(
            count=Count('officerallegation'))
        for officer in officers:
            officer.allegations_count = officer.count
            officer.discipline_count = officer.officerallegation_set\
                .filter(final_outcome_class='disciplined').count()
            officer.save()

        for allegation_cat in AllegationCategory.objects.all():
            allegation_cat.allegations_count = \
                allegation_cat.officerallegation_set.count()
            allegation_cat.category_count = OfficerAllegation.objects.filter(
                cat__category=allegation_cat.category).count()
            allegation_cat.save()
