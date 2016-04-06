from datetime import datetime

from django.views.generic.base import View
from django.http import HttpResponse

from dashboard.admin import DocumentResource
from document.models.document_request_query_set import DocumentRequestQuerySet


class AdminInvestigationDocumentsExportView(View):

    def get(self, request):
        document_type = request.GET.get('document_type', 'CR')
        export = DocumentResource().export(
            queryset=list(DocumentRequestQuerySet().get_filter(type=document_type)))
        response = HttpResponse(
            export.xls, content_type='application/xls', status=200)

        response['Content-Disposition'] = \
            'attachment; filename="document_requests_{today}.xls"'\
            .format(today=datetime.now().strftime('%Y-%m-%d'))
        return response
