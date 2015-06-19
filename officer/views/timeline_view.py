from django.http.response import HttpResponse
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Officer, Allegation


class TimelineView(View):
    def get(self, request):
        officer_id = request.GET.get('officer')
        officer = Officer.objects.get(pk=officer_id)
        allegations = Allegation.objects.filter(officer=officer).exclude(incident_date=None)
        allegations_date = allegations.values_list('incident_date_only', flat=True).order_by('incident_date')

        items = [officer.appt_date] + list(allegations_date)

        result = JSONSerializer().serialize({
            'items': items,
        })

        return HttpResponse(result, content_type='application/json')
