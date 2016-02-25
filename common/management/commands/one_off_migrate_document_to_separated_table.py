from django.core.management.base import BaseCommand

from common.models import Allegation
from document.models.document import Document


class Command(BaseCommand):
    def handle(self, *args, **options):
        for allegation in Allegation.objects.filter(document_id__gt=0):
            Document(
                documentcloud_id=allegation.document_id,
                normalized_title=allegation.document_normalized_title,
                title=allegation.document_title,
                requested=allegation.document_requested,
                pending=allegation.document_pending,
                number_of_request=allegation.number_of_request,
                last_requested=allegation.last_requested,
                type='CR',
                allegation=allegation).save()
