from django.http.response import HttpResponse
from django.views.generic import View

from common.models import Allegation
from common.json_serializer import JSONSerializer

from allegation.views.allegation_query_filter import AllegationQueryFilter
from allegation.services.outcome_analytics import OutcomeAnalytics
from search.models import FilterLog

class AllegationAnalysisAPIView(View):
    def __init__(self, **kwargs):
        super(AllegationAnalysisAPIView, self).__init__(**kwargs)

    def track_filter(self, num_allegations):
        querystring = self.request.META['QUERY_STRING']

        # TODO: New function for this one?
        if 'current_session' in self.request.session:
            session_id = self.request.session['current_session']
        else:
            session_id = ''

        last_log = FilterLog.objects.filter(session_id=session_id).order_by('-created_at').first()

        # We only track for changes
        if querystring and last_log != querystring:
            FilterLog.objects.create(tag_name=querystring,
                                     session_id=session_id,
                                     num_allegations=num_allegations)

    def get_allegations(self, ignore_filters=None):
        allegation_query_filters = AllegationQueryFilter(self.request.GET, ignore_filters)
        allegations = Allegation.objects.by_allegation_filter(allegation_query_filters)

        return allegations

    def get(self, request):
        allegations = self.get_allegations()
        self.track_filter(allegations.count())
        analytics = OutcomeAnalytics.get_analytics(allegations)

        content = JSONSerializer().serialize({
            'analytics': analytics
        })
        return HttpResponse(content)
