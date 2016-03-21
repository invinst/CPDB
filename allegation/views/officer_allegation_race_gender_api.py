import json
from django.db.models.aggregates import Count
from django.http.response import HttpResponse

from allegation.views.officer_allegation_api_view import OfficerAllegationAPIView
from allegation.models.utils import get_num_range_case
from common.models import Officer, ComplainingWitness


def return_dict(l, k, v):
    return {value[k]: value[v] for value in l if value[k]}


OFFICER_AGE_RANGES = [20, 30, 40, 50, 60]
WITNESS_AGE_RANGES = [0, 20, 30, 40, 50]


class OfficerAllegationRaceGenderAPI(OfficerAllegationAPIView):
    def __init__(self, *args, **kwargs):
        super(OfficerAllegationRaceGenderAPI, self).__init__(*args, **kwargs)

    # A bit magical here
    def annotate_count_for(self, items, field):
        return return_dict(list(
            items.values(field).annotate(count=Count(field))), field, 'count')

    def get_officers(self, officer_allegations):
        return Officer.objects.filter(officerallegation__in=officer_allegations)

    def get_witness(self, officer_allegations):
        return ComplainingWitness.objects.filter(
            allegation__in=officer_allegations.values_list('allegation'))

    def get_officer_ages(self):
        officer_allegations = self.get_officer_allegations()
        officer_allegations = officer_allegations.filter(officer_age__isnull=False)\
            .annotate(age_range=get_num_range_case('officer_age', OFFICER_AGE_RANGES))
        return self.annotate_count_for(officer_allegations, 'age_range')

    def get_witness_ages(self):
        officer_allegations = self.get_officer_allegations()
        return self.annotate_count_for(
            self.get_witness(officer_allegations).filter(age__isnull=False, age__gt=0)
            .annotate(age_range=get_num_range_case('age', WITNESS_AGE_RANGES)), 'age_range')

    def get_officer_genders(self):
        officer_allegations = \
            self.get_officer_allegations(['officer__gender'])
        return self.annotate_count_for(
            self.get_officers(officer_allegations), 'gender')

    def get_officer_races(self):
        officer_allegations = \
            self.get_officer_allegations(['officer__race'])
        return self.annotate_count_for(
            self.get_officers(officer_allegations), 'race')

    def get_witness_genders(self):
        officer_allegations = \
            self.get_officer_allegations(['complainant_gender'])
        return self.annotate_count_for(
            self.get_witness(officer_allegations), 'gender')

    def get_witness_races(self):
        officer_allegations = \
            self.get_officer_allegations(['complainant_race'])
        return self.annotate_count_for(
            self.get_witness(officer_allegations), 'race')

    def get(self, request):
        data = {
            'officers': {
                'gender': self.get_officer_genders(),
                'race': self.get_officer_races(),
                'age': self.get_officer_ages()
            },
            'complaining_witness': {
                'gender': self.get_witness_genders(),
                'race': self.get_witness_races(),
                'age': self.get_witness_ages()
            }
        }

        return HttpResponse(json.dumps(data), content_type='application/json')
