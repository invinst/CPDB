import json
from django.core.management.base import BaseCommand
from documentcloud import DocumentCloud
from common.models import Allegation


class Command(BaseCommand):
    help = 'Update complaint documents info'

    id_delim = '-'
    search_syntax = 'CR %s'

    def add_arguments(self, parser):
        parser.add_argument('--start')
        parser.add_argument('--end')

    def handle(self, *args, **options):
        start = options['start']
        end = options['end']

        client = DocumentCloud()
        for allegation in Allegation.objects.filter(id__gte=start, id__lte=end):
            objs = client.documents.search(self.search_syntax % allegation.crid)
            if len(objs) > 0:
                obj = objs[0]

                id_parts = obj.id.split(self.id_delim)
                doc_id = id_parts[0]
                normalized_title = self.id_delim.join(id_parts[1:])
                title = obj.title
                print(allegation.id, title)
                allegation.document_id = doc_id
                allegation.document_normalized_title = normalized_title
                allegation.document_title = title
                allegation.save()
