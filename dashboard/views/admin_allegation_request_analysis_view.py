import json

from django.http import HttpResponse
from django.views.generic import View

from dashboard.query_builders import AllegationDocumentQueryBuilder, DOCUMENT_REQUEST_FILTERS
from document.models import Document


class AdminAllegationRequestAnalysisView(View):
    def get(self, request):
        document_type = request.GET.get('type', 'CR')
        document_request_analysis = {}

        for request_type in DOCUMENT_REQUEST_FILTERS:
            queries = AllegationDocumentQueryBuilder().build({
                'request_type': request_type,
                'document_type': document_type
            })
            document_request_analysis[request_type] = Document.objects.filter(queries).count()

        return HttpResponse(json.dumps(document_request_analysis))
