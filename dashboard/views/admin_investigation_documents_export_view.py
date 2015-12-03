from datetime import datetime

from django.views.generic.base import View
from django.http import HttpResponse

from dashboard.admin import AllegationResource
from dashboard.views.allegation_request_view import DOCUMENT_REQUEST_FILTERS
from common.models import Allegation
from document.models.document_request_query_set import DocumentRequestQuerySet

class AdminInvestigationDocumentsExportView(View):

    def get(self, request):
        export = AllegationResource().export(queryset=DocumentRequestQuerySet().get_filter())
        response = HttpResponse(export.xls, content_type='application/xls', status=200)

        response['Content-Disposition'] = 'attachment; filename="document_requests_{today}.xls"'.format(
            today=datetime.now().strftime('%Y-%m-%d'))
        return response
