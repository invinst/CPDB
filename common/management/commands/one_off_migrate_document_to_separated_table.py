from django.core.management.base import BaseCommand

from common.constants import DOCUMENT_TYPES
from common.models import Allegation
from dashboard.services.documentcloud_service import DocumentcloudService
from document.models import RequestEmail
from document.models import Document


class Command(BaseCommand):

    def handle(self, *args, **options):
        allegations_with_document = Allegation.objects.all()

        documentcloud_service = DocumentcloudService()

        for allegation in allegations_with_document:
            # migrate old documents to document table
            document_type = 'CR'

            if allegation.document_id > 0:
                parsed_title = documentcloud_service.parse_crid_from_title(allegation.document_title)
                if not parsed_title:
                    document_type = 'CPB'

            if document_type == 'CPB':
                document = Document(
                    documentcloud_id=allegation.document_id,
                    normalized_title=allegation.document_normalized_title,
                    title=allegation.document_title,
                    type=document_type,
                    allegation=allegation
                )
            else:
                document = Document(
                    documentcloud_id=allegation.document_id,
                    normalized_title=allegation.document_normalized_title,
                    title=allegation.document_title,
                    requested=allegation.document_requested,
                    pending=allegation.document_pending,
                    number_of_request=allegation.number_of_request,
                    last_requested=allegation.last_requested,
                    type=document_type,
                    allegation=allegation
                )

            document.save()

            # populate allegation document
            for document_type in DOCUMENT_TYPES:
                allegation.documents.get_or_create(type=document_type[0])

            # Migrate request emails to CR document
            if RequestEmail.objects.filter(crid=allegation.crid).exists():
                cr_document = allegation.documents.get(type='CR')
                requestemails = RequestEmail.objects.filter(crid=allegation.crid)
                requestemails.update(document=cr_document)
