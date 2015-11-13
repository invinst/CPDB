from django.core.management.base import BaseCommand
from django.utils.text import slugify

from common.models import Officer


class Command(BaseCommand):
    @staticmethod
    def officer_profile_link(officer):
        return 'http://cpdb.co/#!/officer/{slug}/{id}'.format(id=officer.id, slug=slugify(officer.display_name))

    def handle(self, *args, **options):
        for officer in Officer.objects.all():
            print(self.officer_profile_link(officer))
