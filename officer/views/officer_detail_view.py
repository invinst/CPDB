from django.http.response import HttpResponseNotFound
from django.shortcuts import render
from django.views.generic.base import View
from common.json_serializer import JSONSerializer
from common.models import Officer, Allegation

class OfficerDetailView(View):
    def get(self, request, *args, **kwargs):
        
        officer_id = kwargs['pk']
        officer = Officer.objects.get(id=officer_id)
        allegations = Allegation.objects.filter(officer=officer)
        officer_dict = JSONSerializer().serialize(officer)

        return render(request, 'officer/officer_detail.html', {
            'officer': officer_dict,
            'allegations': allegations
        })


