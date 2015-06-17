from django.core.management.base import BaseCommand
from django.db.models import Count

from common.models import Officer, AllegationCategory, Allegation


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        officers = Officer.objects.all().annotate(count=Count('allegation'))
        for officer in officers:
            officer.allegations_count = officer.count
            officer.discipline_count = officer.allegation_set.exclude(final_outcome='600').count()
            officer.save()

        for allegation_cat in AllegationCategory.objects.all():
            allegation_cat.allegations_count = allegation_cat.allegation_set.count()
            allegation_cat.category_count = Allegation.objects.filter(cat__category=allegation_cat.category).count()
            allegation_cat.save()
