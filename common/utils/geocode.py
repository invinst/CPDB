import json
import urllib

from django.contrib.gis.geos import Point
from django.conf import settings

from common.models import Area


def geocode_address(address, beat=False):
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


def get_address(allegation):
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
        return "%s %s, %s" % (add1, add2, city)

    return ""


def set_areas(allegation, point):
    if point:
        areas = Area.objects.filter(polygon__intersects=point)
        for area in areas:
            allegation.areas.add(area)
