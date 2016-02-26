from django.views.generic import TemplateView
from django.shortcuts import get_object_or_404
from django.http import QueryDict

from share.models import Session
from allegation.query_builders import OfficerAllegationQueryBuilder
from allegation.serializers import SunburstSerializer
from allegation.utils.session import build_query_string_from_session
from common.models import OfficerAllegation


class SunburstView(TemplateView):
    template_name = 'allegation/sunburst.html'

    def get_context_data(self, hash_id=None, **kwargs):
        context = super(SunburstView, self).get_context_data(**kwargs)

        session = get_object_or_404(
            Session, pk=Session.id_from_hash(hash_id)[0])
        query_str = build_query_string_from_session(session)
        query_dict = QueryDict(query_str)
        query_set = OfficerAllegationQueryBuilder().build(query_dict)
        officer_allegations = OfficerAllegation.objects.filter(query_set)
        context['sunburst_data'] = {
            'sunburst': SunburstSerializer(officer_allegations).data
        }
        context['sunburst_arc'] = session.sunburst_arc

        return context
