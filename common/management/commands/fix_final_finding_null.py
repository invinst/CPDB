from django.core.management.base import BaseCommand

from common.models import OfficerAllegation


class Command(BaseCommand):
    help = 'Change final_finding None to ZZ instead'

    def handle(self, *args, **options):
        OfficerAllegation.objects.filter(final_finding=None)\
            .update(final_finding="ZZ")
