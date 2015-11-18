from django.http import HttpResponse
from django.views.generic import View

from common.models import Allegation
from dashboard.views.allegation_request_view import DOCUMENT_REQUEST_FILTERS


class AdminAllegationRequestAnalysisView(View):
    def get(self, request):
        document_request_analysis = {}
        for request_type in DOCUMENT_REQUEST_FILTERS:
            document_request_analysis[request_type] = Allegation.objects.filter(DOCUMENT_REQUEST_FILTERS[request_type])\
                                                                        .distinct('crid').count()

        return HttpResponse(json.dumps(document_request_analysis))
