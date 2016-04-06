from django.core.management.base import BaseCommand

from common.constants import DOCUMENT_TYPES
from common.models import Allegation


class Command(BaseCommand):

    def handle(self, *args, **options):
        allegations = Allegation.objects.filter()

        for allegation in allegations:
            for document_type in DOCUMENT_TYPES:
                allegation.documents.get_or_create(type=document_type[0])
