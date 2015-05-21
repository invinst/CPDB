import re

from django.conf import settings
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
import re
from common.json_serializer import JSONSerializer
from common.models import Allegation, Area, AllegationCategory
import json
#import requests
class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation/home.html'

class FilterAPIView(View):
    def get(self, request, *args, **kwargs):
        filters = {
            'category':AllegationCategory.objects.all(),
            'area_types':list(Area.objects.distinct().values_list('type',flat=True)),
            'final_outcome':list(Allegation.objects.exclude(final_outcome=None).values_list('final_outcome',flat=True).distinct()),
            'final_finding':list(Allegation.objects.exclude(final_finding=None).values_list('final_finding',flat=True).distinct()),
            'recc_finding':list(Allegation.objects.exclude(recc_finding=None).values_list('recc_finding',flat=True).distinct()),
            'recc_outcome':list(Allegation.objects.exclude(recc_outcome=None).values_list('recc_finding',flat=True).distinct()),
        }
        print(filters)
        content = JSONSerializer().serialize(filters)
        return HttpResponse(content)

class AreaAPIView(View):
    def get(self, request, *args, **kwargs):
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
                  "name":area.name,
                  'type':area.type,
                },
                'geometry': polygon
            }


            area_dict['features'].append(area_json)
        content = json.dumps(area_dict)
        #validate_endpoint = 'http://geojsonlint.com/validate'
        #good_request = requests.post(validate_endpoint, data=content)
        #print(good_request.json())
        return HttpResponse(content)

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

    def get_allegations(self):



        filters = ['crid','beat_id','cat','final_outcome','neighborhood_id','recc_finding','final_outcome','recc_outcome','final_finding']
        for filter_field in filters:
            self.add_filter(filter_field)

        filter_names = ['neighborhood__name','beat__name']
        for filter_field in filter_names:
            self.add_icontains_filter(filter_field)

        allegations = Allegation.objects.filter(**self.filters)

        if 'officer_name' in self.request.GET:
            name = self.request.GET.get('officer_name')
            name = name.strip()
            re.sub(r'\s{2,}', '\s', name)

            parts = name.split(' ')
            for part in parts:
                condition = Q(officer__officer_first__icontains=part) | Q(officer__officer_last__icontains=part)
            allegations = allegations.filter(condition)

        if 'start_date' in self.request.GET:
            allegations = allegations.filter(start_date__gte=self.request.GET.get('start_date'))
        if 'end_date' in self.request.GET:
            allegations = allegations.filter(end_date__lte=self.request.GET.get('end_date'))

        if 'latlng' in self.request.GET:
            latlng = self.request.GET['latlng'].split(',')
            if len(latlng) == 2:
                radius = self.request.GET.get('radius',500)
                point = Point(float(latlng[1]), float(latlng[0]))
                allegations = allegations.filter(point__distance_lt=(point,D(m=radius)))
        return allegations

    def get(self, request):
        allegations = self.get_allegations()
        try:
            page = int(self.request.GET.get('page', 1))
        except ValueError:
            page = 1
        start = (page - 1) * settings.ALLEGATION_LIST_ITEM_COUNT
        allegations = allegations[start:start+settings.ALLEGATION_LIST_ITEM_COUNT]
        content = JSONSerializer().serialize(allegations)
        return HttpResponse(content)

class AllegationGISApiView(AllegationAPIView):
    def get(self, request, *args, **kwargs):
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
                  "fillColor": "#eeffee",
                  "fillOpacity": 0.5,
                  "name":allegation.crid,

                },
                'geometry': point
            }
            if allegation.cat:
                allegation_json['properties']['type'] = allegation.cat.allegation_name,
            allegation_dict['features'].append(allegation_json)

        content = json.dumps(allegation_dict)
        return HttpResponse(content)
