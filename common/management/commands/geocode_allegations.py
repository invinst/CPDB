import urllib
import json

from django.core.management.base import BaseCommand
from django.conf import settings
from common.models import Allegation, Area
from django.contrib.gis.geos import Point


class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def add_arguments(self, parser):
        parser.add_argument('--crid', nargs='+', type=str)

    def geocode_address(self, address, beat=False):
        proximity = ""
        if beat and beat.polygon:
            proximity = "&proximity=%(lng)s,%(lat)s" % {'lng': beat.polygon.centroid.x, 'lat': beat.polygon.centroid.y}

        url = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/%(address)s.json?' \
              'access_token=%(mapbox_api_key)s%(proximity)s' \
              % {'address': urllib.parse.quote(address), 'mapbox_api_key': settings.MAP_BOX_API_KEY,
                 'proximity': proximity}
        # print(url)
        try:
            response = urllib.request.urlopen(url)
        except:
            return False
        data = response.read().decode('utf-8')
        ret = json.loads(data)
        for feature in ret['features']:
            if feature['relevance'] > 0.80:
                return Point(*feature['geometry']['coordinates'])
        return False

    def handle(self, *args, **options):
        counter = 0
        kwargs = {}

        if options.get('crid'):
            kwargs['crid__in'] = options['crid']

        for allegation in Allegation.objects.filter(**kwargs):
            for area in allegation.areas.all():
                allegation.areas.remove(area)
            point = None
            city = ""
            add1 = ""
            add2 = ""
            if allegation.add1 and allegation.add1 != '-----':
                add1 = allegation.add1
            if allegation.add2 and allegation.add2 != '-----':
                add2 = allegation.add2
            if allegation.city:
                splitted = allegation.city.split(' ')
                if len(splitted) > 2:
                    city = allegation.city

            if add2 or city:
                if not city:
                    city = "Chicago"
                address_lookup = "%s %s, %s" % (add1, add2, city)
                print(address_lookup)
                point = self.geocode_address(address_lookup, allegation.beat)
            elif allegation.beat:
                point = allegation.beat.polygon.centroid
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
