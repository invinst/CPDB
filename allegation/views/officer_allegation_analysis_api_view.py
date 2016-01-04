from django.http.response import HttpResponse
from django.views.generic import View

from common.models import OfficerAllegation
from common.json_serializer import JSONSerializer
from allegation.services.outcome_analytics import OutcomeAnalytics
from allegation.query_builders import OfficerAllegationQueryBuilder


class OfficerAllegationAnalysisAPIView(View):
    def __init__(self, **kwargs):
        super(OfficerAllegationAnalysisAPIView, self).__init__(**kwargs)

    def get_officer_allegations(self, request, ignore_filters=None):
        queries = OfficerAllegationQueryBuilder()\
            .build(request.GET, ignore_filters)
        return OfficerAllegation.objects.filter(queries)

    def get(self, request):
        officer_allegations = self.get_officer_allegations(request)
        analytics = OutcomeAnalytics.get_analytics(officer_allegations)

        content = JSONSerializer().serialize({
            'analytics': analytics
        })
        return HttpResponse(content)
