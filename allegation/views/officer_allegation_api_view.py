from operator import attrgetter

from django.views.generic import View
from django.conf import settings
from django.http.response import HttpResponse

from allegation.query_builders import OfficerAllegationQueryBuilder
from allegation.services.outcome_analytics import OutcomeAnalytics
from common.models import (
    OfficerAllegation, ComplainingWitness, PoliceWitness, Allegation, Officer)
from common.json_serializer import JSONSerializer


class OfficerAllegationAPIView(View):
    def __init__(self, **kwargs):
        super(OfficerAllegationAPIView, self).__init__(**kwargs)
        self.orig_query_dict = None

    @property
    def query_dict(self):
        return self.orig_query_dict or self.request.GET

    def get_officer_allegations(self, ignore_filters=None):
        queries = OfficerAllegationQueryBuilder()\
            .build(self.query_dict, ignore_filters)
        return OfficerAllegation.objects.filter(queries)

    def get_fetch_range(self, request, officer_allegations):
        try:
            page = int(request.GET.get('page', 0))
        except ValueError:
            page = 0

        length = getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 25)
        try:
            length = int(request.GET.get('length', length))
            if length == -1:
                length = officer_allegations.count()
                page = 0
        except ValueError:
            pass

        start = page * length
        end = page * length + length

        return start, end

    def related_officers(self, allegation, officer_allegation, officers):
        if officer_allegation.officer:
            officers = [
                officer for officer in officers
                if officer.pk != officer_allegation.officer.pk]
        return sorted(
            officers, key=attrgetter('allegations_count'), reverse=True)

    def serialize_officer_allegations(self, officer_allegations):
        results = []
        officer_allegations = officer_allegations.select_related(
            'allegation__beat', 'allegation__investigator', 'allegation',
            'officer')
        allegation_pks = officer_allegations\
            .values_list('allegation__pk', flat=True)
        complaining_witnesses = ComplainingWitness.objects.filter(
            allegation__pk__in=allegation_pks)
        police_witnesses = PoliceWitness.objects.filter(
            allegation__pk__in=allegation_pks)
        related_officers = Officer.objects.filter(
            officerallegation__allegation__pk__in=allegation_pks)

        for officer_allegation in officer_allegations:
            allegation = officer_allegation.allegation

            officer_allegation.final_finding = \
                officer_allegation.get_final_finding_display()
            officer_allegation.final_outcome = \
                officer_allegation.get_final_outcome_display()
            officer_allegation.recc_finding = \
                officer_allegation.get_recc_finding_display()
            officer_allegation.recc_outcome = \
                officer_allegation.get_recc_outcome_display()

            ret = {
                'officer_allegation': officer_allegation,
                'allegation': allegation,
                'officers':
                    self.related_officers(
                        allegation, officer_allegation, related_officers),
                'category': officer_allegation.cat or None,
                'officer': officer_allegation.officer,
                'complaining_witness': [
                    o for o in complaining_witnesses
                    if o.allegation_id == allegation.pk],
                'police_witness': [
                    o for o in police_witnesses
                    if o.allegation_id == allegation.pk],
                'beat_name': allegation.beat.name if allegation.beat else '',
                'investigator': allegation.investigator,
            }
            results.append(ret)

        return results

    def get(self, request):
        officer_allegations = self.get_officer_allegations()
        officer_allegations = officer_allegations.select_related('cat')
        start, end = self.get_fetch_range(request, officer_allegations)

        content = JSONSerializer().serialize({
            'officer_allegations': self.serialize_officer_allegations(
                officer_allegations[start:end]),
            'analytics': OutcomeAnalytics.get_analytics(officer_allegations)
        })
        return HttpResponse(content)
