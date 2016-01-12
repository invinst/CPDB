import json
from django.db.models.aggregates import Count
from django.http.response import HttpResponse
from allegation.views.officer_allegation_api_view import OfficerAllegationAPIView
from common.models import Officer, ComplainingWitness


def return_dict(l, k, v):
    return {value[k]: value[v] for value in l if value[k]}


class OfficerAllegationRaceGenderAPI(OfficerAllegationAPIView):
    def __init__(self, *args, **kwargs):
        super(OfficerAllegationRaceGenderAPI, self).__init__(*args, **kwargs)
        self.ignores = []
        self.with_filters = []
        self.without_filters = []

    # A bit magical here
    def annotate_count_for(self, items, field):
        return return_dict(list(
            items.values(field).annotate(count=Count(field))), field, 'count')

    def get_officers(self, officer_allegations):
        officers_ids = list(
            officer_allegations.distinct()
            .values_list('officer_id', flat=True))
        return Officer.objects.filter(pk__in=officers_ids)

    def get_witness(self, officer_allegations):
        allegation_pks = list(
            officer_allegations.distinct()
            .values_list('allegation__pk', flat=True))
        return ComplainingWitness.objects.filter(
            allegation__pk__in=allegation_pks)

    def get_officer_allegation_without_filters(self):
        if len(self.without_filters) == 0:
            self.without_filters = self.get_officer_allegations()
        return self.without_filters

    def get_officer_allegation_with_filter(self):
        if len(self.with_filters) == 0:
            self.with_filters = self.get_officer_allegations(self.ignores)
        return self.with_filters

    def get_officer_allegations_with_ignored_tags(self, filter_tag):
        if filter_tag not in self.ignores:
            return self.get_officer_allegation_without_filters()

        return self.get_officer_allegation_with_filter()

    def get_officer_genders(self):
        officer_allegations = \
            self.get_officer_allegations_with_ignored_tags('officer__gender')
        return self.annotate_count_for(
            self.get_officers(officer_allegations), 'gender')

    def get_officer_races(self):
        officer_allegations = \
            self.get_officer_allegations_with_ignored_tags('officer__race')
        return self.annotate_count_for(
            self.get_officers(officer_allegations), 'race')

    def get_witness_genders(self):
        officer_allegations = \
            self.get_officer_allegations_with_ignored_tags(
                'complainant_gender')
        return self.annotate_count_for(
            self.get_witness(officer_allegations), 'gender')

    def get_witness_races(self):
        officer_allegations = \
            self.get_officer_allegations_with_ignored_tags('complainant_race')
        return self.annotate_count_for(
            self.get_witness(officer_allegations), 'race')

    def get(self, request):
        self.ignores = [x for x in self.request.GET]

        data = {
            'officers': {
                'gender': self.get_officer_genders(),
                'race': self.get_officer_races(),
            },
            'complaining_witness': {
                'gender': self.get_witness_genders(),
                'race': self.get_witness_races()
            }
        }

        return HttpResponse(json.dumps(data), content_type='application/json')
