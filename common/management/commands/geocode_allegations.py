import urllib
import json

from django.core.management.base import BaseCommand
from django.conf import settings
from common.models import Allegation, Area
from django.contrib.gis.geos import Point


class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def geocode_address(self, address, beat=False):
        proximity = ""
        if beat and beat.polygon:
            proximity = "&proximity=%(lng)s,%(lat)s" % {'lng': beat.polygon.centroid.x, 'lat': beat.polygon.centroid.y}

        url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/%(address)s.json?access_token=%(mapbox_api_key)s%(proximity)s" \
              % {'address': urllib.parse.quote(address), 'mapbox_api_key': settings.MAP_BOX_API_KEY,
                 'proximity': proximity}
        # print(url)
        response = urllib.request.urlopen(url)
        data = response.read().decode('utf-8')
        ret = json.loads(data)
        for feature in ret['features']:
            if feature['relevance'] > 0.80:
                return Point(*feature['geometry']['coordinates'])
        return False

    def handle(self, *args, **options):
        counter = 0

        for allegation in Allegation.objects.filter(point=None):
            city = ''
            add1 = ""
            add2 = ""
            if allegation.add1:
                add1 = allegation.add1
            if allegation.add2:
                add2 = allegation.add2
            if allegation.city:

                splitted = allegation.city.split(' ')
                if len(splitted) > 2:
                    city = allegation.city

            point = None
            allegation.point = None
            if add1 or add2 or city:
                address_lookup = "%s %s, %s" % (add1, add2, city)
                point = self.geocode_address(address_lookup)
            elif allegation.beat:
                point = allegation.beat.centroid
            if point:
                print(point.y, point.x)
                areas = Area.objects.filter(polygon__intersects=point)
                for area in areas:
                    allegation.areas.add(area)

                    allegation.point = point
            allegation.save()
            counter += 1
            if counter % 100 == 0:
                print("Geocoded %d" % counter)
