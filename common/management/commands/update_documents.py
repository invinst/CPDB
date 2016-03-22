from django.core.management.base import BaseCommand
from documentcloud import DocumentCloud

from common.models import DocumentCrawler
from dashboard.services.documentcloud_service import DocumentcloudService
from document.models import Document


class Command(BaseCommand):
    help = 'Update complaint documents info'

    search_syntaxes = [
        ('CR', 'Group: invisibleinstitute title:"CR" !CPB'),
        ('CPB', 'Group: invisibleinstitute title:"CPB"')
    ]

    def process_documentcloud_result(self, result, document_type):
        documentcloud_service = DocumentcloudService()

        crid = documentcloud_service.parse_crid_from_title(result.title, document_type)
        if crid:
            try:
                document = Document.objects.get(allegation__crid=crid, type=document_type)
                parsed_link = documentcloud_service.parse_link(result.published_url)

                update_values = {}
                if parsed_link:
                    update_values.update(parsed_link)
                    update_values['title'] = result.title

                    document.update(**update_values)
            except Document.DoesNotExist:
                pass

    def handle(self, *args, **options):
        client = DocumentCloud()

        for document_type, syntax in self.search_syntaxes:
            results = client.documents.search(syntax)

            if results:
                for result in results:
                    self.process_documentcloud_result(result, document_type)

        DocumentCrawler.objects.create(num_documents=Document.objects.filter(documentcloud_id__gt=0).count())
