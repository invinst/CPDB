from django.views.generic.base import View
import requests
from requests.exceptions import RequestException

from dashboard.services.document_processing import DocumentProcessing
from dashboard.services.documentcloud_service import DocumentcloudService
from document.models.document import Document
from document.response import JsonResponse, HttpResponseBadRequest
from document.tasks import send_document_notification_by_crid_and_link


class DocumentLinkView(View):
    def post(self, request):
        id = request.POST.get('id', '')
        link = request.POST.get('link', '')
        document_type = request.POST.get('document_type', 'CR')

        return self.update_allegation_document(id, link, document_type)

    def update_allegation_document(self, id, link, document_type):
        documentcloud_service = DocumentcloudService()

        parsed_link = documentcloud_service.parse_document_link(link, document_type=document_type)
        if not parsed_link:
            return HttpResponseBadRequest()

        try:
            if id:
                document = Document.objects.get(pk=id)
            else:
                document = Document.objects.get(allegation__crid=parsed_link['allegation_crid'], type=document_type)
        except Document.DoesNotExist:
            return HttpResponseBadRequest(content={
                'errors': ['Document not exist']
            })

        try:
            get_title_resp = requests.get(link)
        except RequestException:
            return HttpResponseBadRequest(content={
                'errors': ['Document not exist']
            })

        if get_title_resp.status_code == 404:
            return HttpResponseBadRequest(content={
                'errors': ['Document not exist']
            })

        title = documentcloud_service.get_title(get_title_resp.content.decode())

        document_params = {
            'documentcloud_id': parsed_link['documentcloud_id'],
            'normalized_title': parsed_link['normalized_title'],
            'title': title
        }

        DocumentProcessing(document).update_link(document_params)

        send_document_notification_by_crid_and_link.delay(document.allegation.crid, link, document_type)

        return JsonResponse({
            'status': 200,
            'crid': document.allegation.crid
        })
