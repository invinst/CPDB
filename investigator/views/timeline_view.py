from django.http.response import HttpResponse
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Investigator, Allegation


class TimelineView(View):
    def get(self, request):
        investigator_id = request.GET.get('investigator')
        investigator = Investigator.objects.get(pk=investigator_id)
        allegations = Allegation.objects.filter(investigator=investigator)
        allegations_date = allegations.values_list('incident_date_only','start_date').order_by('incident_date')

        items = []
        for date in allegations_date:
            if not date[0] and date[1]:
                items.append(date[1])
            elif date[0]:
                items.append(date[0])
        items = sorted(items)

        result = JSONSerializer().serialize({
            'items': items,
        })

        return HttpResponse(result, content_type='application/json')
