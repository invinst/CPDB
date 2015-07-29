from django.core.management.base import BaseCommand
from documentcloud import DocumentCloud

from common.models import Allegation
from document.utils import send_document_notification


class Command(BaseCommand):
    help = 'Update complaint documents info'

    id_delim = '-'
    search_syntax = 'title:CR %s'

    def add_arguments(self, parser):
        parser.add_argument('--start')
        parser.add_argument('--end')

    def handle(self, *args, **options):
        start = options['start']
        if start is None:
            start = 1
        end = options['end']

        if end is not None:
            allegations = Allegation.objects.filter(id__gte=start, id__lte=end)
        else:
            allegations = Allegation.objects.filter(id__gte=start)

        document_by_crid = {}

        client = DocumentCloud()
        for allegation in allegations:
            document = None

            if allegation.crid in document_by_crid:
                document = document_by_crid[allegation.crid]
            else:
                objs = client.documents.search(self.search_syntax % allegation.crid)
                if len(objs) > 0:
                    document = objs[0]
                    document_by_crid[allegation.crid] = document

                    if document.title != allegation.document_title:  # new document found
                        # send notification
                        send_document_notification(allegation, document)
                else:
                    document_by_crid[allegation.crid] = None

            if document:
                document_by_crid[allegation.crid] = document

                id_parts = document.id.split(self.id_delim)
                doc_id = id_parts[0]
                normalized_title = self.id_delim.join(id_parts[1:])
                title = document.title

                allegation.document_id = doc_id
                allegation.document_normalized_title = normalized_title
                allegation.document_title = title
            else:
                document_by_crid[allegation.crid] = None

                allegation.document_id = 0
                allegation.document_normalized_title = ''
                allegation.document_title = ''

            allegation.save()
