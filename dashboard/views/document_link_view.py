from django.views.generic.base import View

from dashboard.services.documentcloud_service import DocumentcloudService
from document.models import Document
from document.response import JsonResponse, HttpResponseBadRequest


class DocumentLinkView(View):
    def post(self, request):
        id = request.POST.get('id', '')
        link = request.POST.get('link', '')
        document_type = request.POST.get('document_type', 'CR')

        return self.update_allegation_document(id, link, document_type)

    def update_allegation_document(self, id, link, document_type):
        documentcloud_service = DocumentcloudService()
        parsed_link = documentcloud_service.process_link(link, document_type=document_type)

        if not parsed_link:
            return HttpResponseBadRequest(content={
                'errors': ['Invalid document link']
            })

        try:
            if id:
                document = Document.objects.get(pk=id)
            else:
                document = Document.objects.get(allegation__crid=parsed_link['allegation_crid'], type=document_type)
        except Document.DoesNotExist:
            return HttpResponseBadRequest(content={
                'errors': ['Document not exist']
            })

        document_params = {
            'documentcloud_id': parsed_link['documentcloud_id'],
            'normalized_title': parsed_link['normalized_title'],
            'title': parsed_link['title']
        }

        document.update(**document_params)

        return JsonResponse({
            'status': 200,
            'crid': document.allegation.crid
        })
