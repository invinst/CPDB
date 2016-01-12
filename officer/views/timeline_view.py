from django.http.response import HttpResponse
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Officer, OfficerAllegation


class TimelineView(View):
    def get(self, request):
        officer_id = request.GET.get('officer')
        officer = Officer.objects.get(pk=officer_id)
        officer_allegations = OfficerAllegation.objects.filter(officer=officer)
        allegations_date = officer_allegations\
            .values_list('allegation__incident_date_only', 'start_date')\
            .order_by('allegation__incident_date')

        items = []
        for date in allegations_date:
            if not date[0] and date[1]:
                items.append(date[1])
            elif date[0]:
                items.append(date[0])
        items = [officer.appt_date] + sorted(items)

        result = JSONSerializer().serialize({
            'items': items,
        })

        return HttpResponse(result, content_type='application/json')
