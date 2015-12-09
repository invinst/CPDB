from django.core.management.base import BaseCommand
from django.contrib.gis.measure import D

from common.models import Allegation, Area


class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def add_arguments(self, parser):
        parser.add_argument('--radius')

    def handle(self, *args, **options):
        radius = int(options['radius']) or 1000

        for allegation in Allegation.objects.filter(areas__type='school-grounds'):
            allegation.areas.filter(type='school-grounds').delete()

        for school in Area.objects.filter(type='school-grounds'):
            center = school.polygon.centroid
            for allegation in Allegation.objects.filter(point__distance_lte=(center, D(m=radius))):
                allegation.areas.add(school)
