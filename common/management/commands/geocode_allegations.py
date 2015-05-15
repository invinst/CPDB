import os
import urllib
import json
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from common.models import Allegation, Neighborhood
from django.contrib.gis.geos import Point

class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def geocode_address(self,address,beat):
        proximity = ""
        if beat and beat.polygon:
            proximity = "&proximity=%(lng)s,%(lat)s" %  {'lng':beat.polygon.centroid.x,'lat':beat.polygon.centroid.y}

        url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/%(address)s.json?access_token=%(mapbox_api_key)s%(proximity)s" \
                     % {'address':urllib.parse.quote(address),'mapbox_api_key':settings.MAP_BOX_API_KEY,'proximity':proximity}
        #print(url)
        response = urllib.request.urlopen(url)
        data = response.read().decode('utf-8')
        ret = json.loads(data)
        for feature in ret['features']:
            if feature['relevance'] > 0.9:
                return Point(*feature['geometry']['coordinates'])
        return False


    def handle(self, *args, **options):
        counter = 0
        for allegation in Allegation.objects.filter():
            city = 'Chicago'
            add1 = ""
            add2 = ""
            if allegation.add1:
                add1 = allegation.add1
            if allegation.add2:
                add2 = allegation.add2
            if allegation.city:
                city = allegation.city

            point = self.geocode_address("%s %s, %s" % (add1,add2,city),allegation.beat)
            if point:
                neighborhoods = Neighborhood.objects.filter(polygon__intersects=point)
                if neighborhoods.count() == 1:
                    allegation.neighborhoods = neighborhoods[0]

                allegation.point = point
                allegation.save()
            counter += 1
            if counter % 100 == 0:
                print("Geocoded %d" % counter)