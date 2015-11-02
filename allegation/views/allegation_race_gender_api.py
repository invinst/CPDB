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
    # A bit magical here
    def annotate_count_for(self, items, field):
        return return_dict(list(items.values(field).annotate(count=Count(field))), field, 'count')

    def get(self, request):
        allegations = self.get_allegations()
        ignore = [x for x in self.request.GET]
        allegations_without_filters = self.get_allegations(ignore_filters=ignore)

        # We need to cast them to list to get out the risk of Django's bad translated SQL
        # Anyway, this is fucking slow
        officer_ids = list(allegations.distinct().values_list('officer_id', flat=True))
        crids = list(allegations.distinct().values_list('crid', flat=True))
        witness = ComplainingWitness.objects.filter(crid__in=crids)

        officers = Officer.objects.filter(pk__in=officer_ids)
        officer_genders = self.annotate_count_for(officers, 'gender')
        officer_races = self.annotate_count_for(officers, 'race')

        witness = ComplainingWitness.objects.filter(crid__in=crids)
        witness_genders = self.annotate_count_for(witness, 'gender')
        witness_races = self.annotate_count_for(witness, 'race')

        data = {
            'officers': {
                'gender': officer_genders,
                'race': officer_races
            },
            'complaining_witness': {
                'gender': witness_genders,
                'race': witness_races
            }
        }

        return HttpResponse(json.dumps(data), content_type='application/json')
