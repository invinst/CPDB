from django.conf import settings
from django.http.response import HttpResponse
from django.views.generic import View

from common.models import Allegation, Officer
from common.models import ComplainingWitness, PoliceWitness
from common.json_serializer import JSONSerializer

from allegation.views.allegation_query_filter import AllegationQueryFilter
from search.models import FilterLog


class AllegationAPIView(View):
    def __init__(self, **kwargs):
        super(AllegationAPIView, self).__init__(**kwargs)

    def get_allegations(self, ignore_filters=None):
        allegation_query_filters = AllegationQueryFilter(self.request, ignore_filters)
        allegations = Allegation.allegations.by_allegation_filter(allegation_query_filters)

        return allegations

    def track_filter(self, num_allegations):
        querystring = self.request.META['QUERY_STRING']
        if querystring:
            FilterLog.objects.create(query=querystring,
                                 session_id=self.request.session.session_key or "",
                                 num_allegations=num_allegations)

    def get(self, request):
        allegations = self.get_allegations()
        allegations = allegations.order_by('-incident_date', '-start_date', 'crid')
        self.track_filter(num_allegations=len(allegations))

        try:
            page = int(request.GET.get('page', 0))
        except ValueError:
            page = 0

        length = getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200)
        try:
            length = int(request.GET.get('length', length))
        except ValueError:
            pass

        allegations = allegations.select_related('cat')

        start = page * length
        end = page * length + length

        display_allegations = allegations[start:end]
        allegations_list = []

        for allegation in display_allegations:
            category = None
            if allegation.cat:
                category = allegation.cat

            witness = ComplainingWitness.objects.filter(crid=allegation.crid)
            police_witness = PoliceWitness.objects.filter(crid=allegation.crid)

            allegation.final_finding = allegation.get_final_finding_display()
            allegation.final_outcome = allegation.get_final_outcome_display()
            allegation.recc_finding = allegation.get_recc_finding_display()
            allegation.recc_outcome = allegation.get_recc_outcome_display()

            officer_ids = Allegation.objects.filter(crid=allegation.crid).values('officer')
            officers = Officer.objects.filter(pk__in=officer_ids)
            if allegation.officer:
                officers = officers.exclude(pk=allegation.officer.pk)
            officers = officers.order_by('-allegations_count')

            ret = {
                'allegation': allegation,
                'officers': officers,
                'category': category,
                'officer': allegation.officer,
                'complaining_witness': witness,
                'police_witness': police_witness,
            }
            allegations_list.append(ret)

        content = JSONSerializer().serialize({
            'allegations': allegations_list,
            'iTotalRecords': Allegation.objects.all().count(),
            'iTotalDisplayRecords': allegations.count(),
        })
        return HttpResponse(content)
