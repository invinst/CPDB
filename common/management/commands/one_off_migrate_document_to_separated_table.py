from django.core.management.base import BaseCommand
from django.db.models import Q

from common.models import Allegation
from document.models import RequestEmail
from document.models.document import Document


class Command(BaseCommand):

    def handle(self, *args, **options):
        allegations_with_document = Allegation.objects.filter(
            Q(document_id__gt=0) |
            Q(document_pending=True) |
            Q(document_requested=True) |
            Q(number_of_request__gt=0))

        for allegation in allegations_with_document:
            document = Document(
                documentcloud_id=allegation.document_id,
                normalized_title=allegation.document_normalized_title,
                title=allegation.document_title,
                requested=allegation.document_requested,
                pending=allegation.document_pending,
                number_of_request=allegation.number_of_request,
                last_requested=allegation.last_requested,
                type='CR',
                allegation=allegation
            )

            document.save()

            requestemails = RequestEmail.objects.filter(crid=allegation.crid)
            requestemails.update(document=document)
