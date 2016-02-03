import urllib
import json

from django.core.management.base import BaseCommand
from common.models import Allegation, Area


from common.utils.geocode import geocode_address, get_address, set_areas


class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def add_arguments(self, parser):
        parser.add_argument('--crid', nargs='+', type=str)
        parser.add_argument('--verbose', nargs='+', type=str)

    def handle(self, *args, **options):
        counter = 0
        kwargs = {}
        verbose = options.get('verbose') != False

        if options.get('crid'):
            kwargs['crid__in'] = options['crid']

        for allegation in Allegation.objects.filter(**kwargs):
            for area in allegation.areas.all():
                allegation.areas.remove(area)
            address_lookup = get_address(allegation)
            point = geocode_address(address_lookup, allegation.beat)
            if not point and allegation.beat:
                point = allegation.beat.polygon.centroid

            set_areas(allegation, point)

            if point:
                allegation.point = point
                if verbose:
                    print(allegation.crid, point.x, point.y, allegation.add1, allegation.add2, allegation.city)
                allegation.save()
            counter += 1
            if counter % 100 == 0 and verbose:
                print("Geocoded %d" % counter)
