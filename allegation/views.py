import re

from django.conf import settings
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView

from common.json_serializer import JSONSerializer
from common.models import Allegation


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation/allegation_list.html'


class AllegationAPIView(View):
    def get(self, request):
        try:
            start = int(request.GET.get('start', 0))
        except ValueError:
            start = 0
        try:
            length = int(request.GET.get('length', 0))
        except ValueError:
            length = getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200)

        allegations = Allegation.objects.all()

        if 'crid' in request.GET:
            crid = request.GET.get('crid')
            allegations = allegations.filter(crid=crid)

        if 'cat' in request.GET:
            cat = request.GET.get('cat')
            allegations = allegations.filter(cat=cat)

        if 'category' in request.GET:
            category = request.GET.get('category')
            allegations = allegations.filter(cat__category=category)

        if 'officer_name' in request.GET:
            names = request.GET.getlist('officer_name')
            condition = Q()

            for name in names:
                name = name.strip()
                re.sub(r'\s{2,}', '\s', name)
                parts = name.split(' ')
                full_name_search = Q(Q(officer__officer_first=parts[0]) & Q(officer__officer_last=" ".join(parts[1:])))
                condition = condition | full_name_search

            allegations = allegations.filter(condition)

        if 'final_outcome' in request.GET:
            final_outcome = request.GET.get('final_outcome')
            allegations = allegations.filter(final_outcome=final_outcome)

        if 'start_date' in request.GET:
            allegations = allegations.filter(start_date__gte=request.GET.get('start_date'))
        if 'end_date' in request.GET:
            allegations = allegations.filter(end_date__lte=request.GET.get('end_date'))

        fields = [
            'id',
            'crid',
            'incident_date',
            'officer__id',  # placeholder for name
            'cat__allegation_name',
            'officer__officer_first',
            'officer__officer_last',
        ]

        def concat_name(value):
            result = list(value[0:5])
            result[3] = "%s %s" % (value[5], value[6])
            return result

        order_column = request.GET.get('order[0][column]')
        if order_column:
            order = fields[int(order_column)]
            if request.GET.get('order[0][dir]') == 'asc':
                allegations = allegations.order_by(order)
            else:
                allegations = allegations.order_by("-%s" % order)

        display_allegations = allegations[start:start+length].values_list(*fields)

        allegations_list = [concat_name(x) for x in display_allegations]

        content = JSONSerializer().serialize({
            'allegations': allegations_list,
            'iTotalRecords': Allegation.objects.all().count(),
            'iTotalDisplayRecords': allegations.count()
        })
        return HttpResponse(content)
