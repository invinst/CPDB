from django.conf import settings
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
import re
from common.json_serializer import JSONSerializer
from common.models import Allegation


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation_list.html'


class AllegationAPIView(View):
    filters = {}
    def add_filter(self,field):
        value = self.request.GET.get(field,None)
        if value:
            self.filters[field] = value

    def add_icontains_filter(self,field):
        value = self.request.GET.get(field,None)
        if value:
            self.filters["%s__icontains" % field] = value

    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
        except ValueError:
            page = 1


        filters = ['crid','beat_id','cat','final_outcome','neighborhood_id']
        for filter_field in filters:
            self.add_filter(filter_field)

        filter_names = ['neighborhood__name','beat__name']
        for filter_field in filter_names:
            self.add_icontains_filter(filter_field)

        allegations = Allegation.objects.filter(**self.filters)

        if 'officer_name' in request.GET:
            name = request.GET.get('officer_name')
            name = name.strip()
            re.sub(r'\s{2,}', '\s', name)

            parts = name.split(' ')
            for part in parts:
                condition = Q(officer__officer_first__icontains=part) | Q(officer__officer_last__icontains=part)
            allegations = allegations.filter(condition)

        if 'start_date' in request.GET:
            allegations = allegations.filter(start_date__gte=request.GET.get('start_date'))
        if 'end_date' in request.GET:
            allegations = allegations.filter(end_date__lte=request.GET.get('end_date'))

        if 'latlng' in request.GET:
            latlng = request.GET['latlng'].split(',')
            if len(latlng) == 2:
                radius = request.GET.get('radius',500)
                point = Point(float(latlng[1]), float(latlng[0]))
                allegations = allegations.filter(point__distance_lt=(point,D(m=radius)))

        start = (page - 1) * settings.ALLEGATION_LIST_ITEM_COUNT
        allegations = allegations[start:start+settings.ALLEGATION_LIST_ITEM_COUNT]
        content = JSONSerializer().serialize(allegations)
        return HttpResponse(content)
