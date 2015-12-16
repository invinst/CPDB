import json
from django.conf import settings
from django.db.models.aggregates import Count
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Investigator, Allegation, PoliceWitness


class InvestigatorDetailView(View):
    def get(self, request):
        investigator_id = request.GET.get('pk')
        investigator = Investigator.objects.get(id=investigator_id)
        allegations = Allegation.objects.filter(investigator=investigator)
        has_map = allegations.exclude(point=None).count() > settings.MAP_POINT_THRESHOLD

        return HttpResponse(JSONSerializer().serialize({
            'investigator': investigator,
            'allegations': allegations,
            'has_map': has_map
        }))
