from django.core.management.base import BaseCommand
from django.contrib.gis.measure import D

from common.models import Allegation, Area


class Command(BaseCommand):
    help = 'GeoCode Allegations'

    def add_arguments(self, parser):
        parser.add_argument('--radius')

    def handle(self, *args, **options):
        radius = int(options['radius']) or 1000

        for allegation_id in Allegation.objects.filter(areas__type='school-grounds').values_list('id', flat=True):
            Allegation(id=allegation_id).areas.filter(type='school-grounds').delete()

        for school in Area.objects.filter(type='school-grounds').defer('created_at', 'modified_at'):
            center = school.polygon.centroid
            for allegation_id in Allegation.objects.filter(
                    point__distance_lte=(center, D(m=radius))).values_list('id', flat=True):
                Allegation(id=allegation_id).areas.add(school)
