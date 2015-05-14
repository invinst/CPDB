import os
import urllib
import json
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from common.models import Allegation
from django.contrib.gis.geos import Point

class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def geocode_address(self,address):
        url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/%(address)s.json?access_token=%(mapbox_api_key)s" % {'address':urllib.parse.quote(address),'mapbox_api_key':settings.MAP_BOX_API_KEY}
        print(url)
        response = urllib.request.urlopen(url)
        data = response.read().decode('utf-8')
        ret = json.loads(data)
        for feature in ret['features']:
            if feature['relevance'] > 0.9:
                return Point(*feature['geometry']['coordinates'])
        return False


    def handle(self, *args, **options):
        for allegation in Allegation.objects.filter(point=None):
            city = 'Chicago'
            add1 = ""
            add2 = ""
            if allegation.add1:
                add1 = allegation.add1
            if allegation.add2:
                add2 = allegation.add2
            if allegation.city:
                city = allegation.city

            point = self.geocode_address("%s %s, %s" % (add1,add2,city))
            if point:
                allegation.point = point
                allegation.save()