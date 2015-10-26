from django.core.management.base import BaseCommand

from common.models import Allegation


class Command(BaseCommand):
    help = 'Change final_finding None to ZZ instead'

    def handle(self, *args, **options):
        Allegation.objects.filter(final_finding=None).update(final_finding="ZZ")