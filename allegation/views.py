from django.conf import settings
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView
import re
from common.json_serializer import JSONSerializer
from common.models import Allegation


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation_list.html'


class AllegationAPIView(View):
    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
        except ValueError:
            page = 1
        allegations = Allegation.objects.all()

        if 'crid' in request.GET:
            crid = request.GET.get('crid')
            allegations = allegations.filter(crid=crid)

        if 'cat' in request.GET:
            cat = request.GET.get('cat')
            allegations = allegations.filter(cat=cat)

        if 'officer_name' in request.GET:
            name = request.GET.get('officer_name')
            name = name.strip()
            re.sub(r'\s{2,}', '\s', name)

            parts = name.split(' ')
            for part in parts:
                condition = Q(officer__officer_first__icontains=part) | Q(officer__officer_last__icontains=part)
            allegations = allegations.filter(condition)

        if 'final_outcome' in request.GET:
            final_outcome = request.GET.get('final_outcome')
            allegations = allegations.filter(final_outcome=final_outcome)

        if 'start_date' in request.GET:
            allegations = allegations.filter(start_date__gte=request.GET.get('start_date'))
        if 'end_date' in request.GET:
            allegations = allegations.filter(end_date__lte=request.GET.get('end_date'))

        start = (page - 1) * settings.ALLEGATION_LIST_ITEM_COUNT
        allegations = allegations[start:start+settings.ALLEGATION_LIST_ITEM_COUNT]
        content = JSONSerializer().serialize(allegations)
        return HttpResponse(content)
