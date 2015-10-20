import json
from django.db.models.aggregates import Count
from django.http.response import HttpResponse
from allegation.views.allegation_api_view import AllegationAPIView
from common.models import Officer, ComplainingWitness

def return_dict(l, k, v):
    ret = {}
    for key, value in enumerate(l):
        if value[k]:
            ret[value[k]] = value[v]
    return ret

class AllegationRaceGenderAPI(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()

        officer_ids = allegations.distinct().values_list('officer_id', flat=True)
        crids = allegations.distinct().values_list('crid', flat=True)

        officers = Officer.objects.filter(pk__in=officer_ids)
        officer_genders_list = list(officers.values('gender').annotate(count=Count('gender')))
        officer_genders = return_dict(officer_genders_list, 'gender', 'count')

        officer_races = return_dict(list(officers.values('race').annotate(count=Count('race'))), 'race', 'count')

        witness = ComplainingWitness.objects.filter(crid__in=crids)
        complaining_genders = return_dict(list(witness.values('gender').annotate(count=Count('gender'))), 'gender', 'count')
        complaining_races = return_dict(list(witness.values('race').annotate(count=Count('race'))), 'race', 'count')

        data = {
            'officers': {
                'gender': officer_genders,
                'race': officer_races
            },
            'complaining_witness': {
                'gender': complaining_genders,
                'race': complaining_races
            }
        }

        return HttpResponse(json.dumps(data), content_type='application/json')
