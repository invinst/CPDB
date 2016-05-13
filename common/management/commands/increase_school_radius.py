from django.core.management.base import BaseCommand
from django.contrib.gis.measure import D

from common.models import Allegation, Area


class Command(BaseCommand):
    '''
    This command will remove all the current school grounds in database, and then re-assign these school grounds to
    each allegation, with radius is supplied, default is 150
    '''
    help = 'GeoCode Allegations'

    def handle(self, *args, **options):
        self.remove_all_school_grounds_from_allegation()
        self.assign_school_grounds_to_allegation()

    def remove_all_school_grounds_from_allegation(self):
        for allegation in Allegation.objects.filter(areas__type='school-grounds'):
            areas = allegation.areas.filter(type='school-grounds')
            allegation.areas.remove(*areas)

    def assign_school_grounds_to_allegation(self, radius=150):
        for school in Area.objects.filter(type='school-grounds').defer('created_at', 'modified_at'):
            center = school.polygon.centroid
            for allegation in Allegation.objects.filter(point__distance_lte=(center, D(m=radius))):
                allegation.areas.add(school)
