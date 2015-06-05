from django.http.response import HttpResponseNotFound
from django.shortcuts import render
from django.views.generic.base import View
from common.models import Officer, Allegation


class OfficerDetailView(View):
    def get(self, request):
        if 'id' not in request.GET:
            return HttpResponseNotFound()
        officer_id = request.GET.get('id')

        officer = Officer.objects.get(id=officer_id)
        allegations = Allegation.objects.filter(officer=officer)

        return render(request, 'officer/officer_detail.html', {
            'officer': officer,
            'allegations': allegations
        })


