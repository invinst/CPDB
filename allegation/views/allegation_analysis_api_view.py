from django.http.response import HttpResponse
from django.views.generic import View

from common.models import Allegation
from common.json_serializer import JSONSerializer

from allegation.views.allegation_query_filter import AllegationQueryFilter
from allegation.services.outcome_analytics import OutcomeAnalytics


class AllegationAnalysisAPIView(View):
    def __init__(self, **kwargs):
        super(AllegationAnalysisAPIView, self).__init__(**kwargs)

    def get_allegations(self, ignore_filters=None):
        allegation_query_filters = AllegationQueryFilter(self.request.GET, ignore_filters)
        allegations = Allegation.objects.by_allegation_filter(allegation_query_filters)

        return allegations

    def get(self, request):
        allegations = self.get_allegations()

        analytics = OutcomeAnalytics.get_analytics(allegations)

        content = JSONSerializer().serialize({
            'analytics': analytics
        })
        return HttpResponse(content)
