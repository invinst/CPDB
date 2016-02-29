from operator import attrgetter

from django.db.models.aggregates import Count
from django.views.generic import View
from django.conf import settings
from django.http.response import HttpResponse

from allegation.query_builders import OfficerAllegationQueryBuilder
from allegation.services.outcome_analytics import OutcomeAnalytics
from common.models import (
    OfficerAllegation, ComplainingWitness, PoliceWitness)
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

    def related_officers(self, allegation, officer_allegation):
        officers = filter(
            None, [o.officer for o in allegation.officerallegation_set.all()])
        if officer_allegation.officer:
            officers = [
                officer for officer in officers
                if officer.pk != officer_allegation.officer.pk]
        return sorted(
            officers, key=attrgetter('allegations_count'), reverse=True)

    def create_investigator_allegation_count_map(self, officer_allegations):
        investigators = officer_allegations.values_list('allegation__investigator_id', flat=True)
        investigators = list(investigators)

        investigator_complaint_counts = OfficerAllegation.objects.filter(
            allegation__investigator__in=investigators)\
            .values('allegation__investigator_id').annotate(count=Count('allegation_id'))

        investigator_discipline_counts = OfficerAllegation.disciplined.filter(
            allegation__investigator__in=investigators)\
            .values('allegation__investigator_id').annotate(count=Count('allegation_id'))

        complaints = {x['allegation__investigator_id']: x['count'] for x in investigator_complaint_counts}
        disciplined = {x['allegation__investigator_id']: x['count'] for x in investigator_discipline_counts}
        investigator_map = {'complaints': complaints, 'disciplined': disciplined}

        return investigator_map

    def serialize_officer_allegations(self, officer_allegations):
        results = []
        officer_allegations = officer_allegations.select_related(
            'allegation__beat', 'allegation__investigator', 'allegation',
            'officer')
        complaining_witnesses = ComplainingWitness.objects.filter(
            allegation__officerallegation__in=officer_allegations)
        police_witnesses = PoliceWitness.objects.filter(
            allegation__officerallegation__in=officer_allegations)

        investigator_allegation_count_map = self.create_investigator_allegation_count_map(officer_allegations)

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

            allegation.location = "{id}. {name}".format(
                id=allegation.location,
                name=allegation.get_location_display()
            )

            if allegation.investigator:
                allegation.investigator.complaint_count = investigator_allegation_count_map['complaints']\
                    .get(allegation.investigator_id, 0)
                allegation.investigator.discipline_count = investigator_allegation_count_map['disciplined']\
                    .get(allegation.investigator_id, 0)

            ret = {
                'officer_allegation': officer_allegation,
                'allegation': allegation,
                'officers':
                    self.related_officers(allegation, officer_allegation),
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
        officer_allegations = officer_allegations.order_by(
            '-allegation__incident_date', '-start_date', 'allegation__crid')
        officer_allegations = officer_allegations.select_related('cat')
        start, end = self.get_fetch_range(request, officer_allegations)

        content = JSONSerializer().serialize({
            'officer_allegations': self.serialize_officer_allegations(
                officer_allegations[start:end]),
            'analytics': OutcomeAnalytics.get_analytics(officer_allegations)
        })
        return HttpResponse(content, content_type='application/json')
