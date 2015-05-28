import re
import json

from django.conf import settings

from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic import View
from django.views.generic import TemplateView
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from common.json_serializer import JSONSerializer
from common.models import Allegation, Area, AllegationCategory


class AllegationListView(TemplateView):
    template_name = 'allegation/home.html'


class FilterAPIView(View):
    def get(self, request):
        filters = {
            'category':AllegationCategory.objects.all(),
            'area_types':list(Area.objects.distinct().values_list('type',flat=True)),
            'final_outcome':list(Allegation.objects.exclude(final_outcome=None).values_list('final_outcome',flat=True).distinct()),
            'final_finding':list(Allegation.objects.exclude(final_finding=None).values_list('final_finding',flat=True).distinct()),
            'recc_finding':list(Allegation.objects.exclude(recc_finding=None).values_list('recc_finding',flat=True).distinct()),
            'recc_outcome':list(Allegation.objects.exclude(recc_outcome=None).values_list('recc_finding',flat=True).distinct()),
        }
        for field in ['final_outcome', 'final_finding', 'recc_finding', 'recc_outcome']:
            filters[field] = Allegation.objects.exclude(**{field: None}).values_list(field, flat=True).distinct()

        content = JSONSerializer().serialize(filters)
        return HttpResponse(content)


class AreaAPIView(View):
    def get(self, request):
        areas = Area.objects.filter(type=request.GET.get('type'))
        area_dict = {
            "type": "FeatureCollection",
            "features": [],
        }
        for area in areas:
            polygon = None
            if area.polygon:
                polygon = json.loads(area.polygon.geojson)
            area_json = {
                "type": "Feature",
                "properties": {
                  "fillColor": "#eeffee",
                  "fillOpacity": 0.5,
                  "weight":1,
                  "name":area.name,
                  'type':area.type,
                },
                'geometry': polygon
            }

            area_dict['features'].append(area_json)
        content = json.dumps(area_dict)
        return HttpResponse(content)


class AllegationAPIView(View):
    def __init__(self, *args, **kwargs):
        super(AllegationAPIView, self).__init__(*args, **kwargs)
        self.filters = {}

    def add_filter(self, field):
        value = self.request.GET.getlist(field, None)
        if len(value) > 1:
            self.filters["%s__in" % field] = value

        elif value:
            self.filters[field] = value[0]

    def add_icontains_filter(self, field):
        value = self.request.GET.get(field, None)
        if value:
            self.filters["%s__icontains" % field] = value

    def get_allegations(self):
        filters = ['crid', 'beat_id', 'cat', 'final_outcome', 'neighborhood_id', 'recc_finding',
                   'final_outcome', 'recc_outcome', 'final_finding', 'officer_id']
        for filter_field in filters:
            self.add_filter(filter_field)

        filter_names = ['neighborhood__name', 'beat__name']
        for filter_field in filter_names:
            self.add_icontains_filter(filter_field)

        if 'category' in self.request.GET:
            self.filters['cat__category'] = self.request.GET['category']

        allegations = Allegation.objects.filter(**self.filters)

        if 'start_date' in self.request.GET:
            allegations = allegations.filter(start_date__gte=self.request.GET.get('start_date'))
        if 'end_date' in self.request.GET:
            allegations = allegations.filter(end_date__lte=self.request.GET.get('end_date'))

        if 'latlng' in self.request.GET:
            latlng = self.request.GET['latlng'].split(',')
            if len(latlng) == 2:
                radius = self.request.GET.get('radius', 500)
                point = Point(float(latlng[1]), float(latlng[0]))
                allegations = allegations.filter(point__distance_lt=(point, D(m=radius)))
        return allegations

    def get(self, request):
        allegations = self.get_allegations()

        try:
            start = int(request.GET.get('start', 0))
        except ValueError:
            start = 0

        length = getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200)
        try:
            length = int(request.GET.get('length', length))
        except ValueError:
            pass

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

        display_allegations = allegations[start:start + length].values_list(*fields)
        allegations_list = [concat_name(x) for x in display_allegations]

        content = JSONSerializer().serialize({
            'allegations': allegations_list,
            'iTotalRecords': Allegation.objects.all().count(),
            'iTotalDisplayRecords': allegations.count()
        })
        return HttpResponse(content)


class AllegationGISApiView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()
        allegation_dict = {
            "type": "FeatureCollection",
            "features": [],
        }
        for allegation in allegations:
            point = None
            if allegation.point:
                point = json.loads(allegation.point.geojson)

            allegation_json = {
                "type": "Feature",
                "properties": {
                  "name":allegation.crid,
                },
                'geometry': point
            }
            if allegation.cat:
                allegation_json['properties']['type'] = allegation.cat.allegation_name,
            allegation_dict['features'].append(allegation_json)

        content = json.dumps(allegation_dict)
        return HttpResponse(content)
