from django.contrib.gis.utils import LayerMapping
from django.core.management import BaseCommand

from common.models import Area


class Command(BaseCommand):
    '''
    This command will get the file parameter is the shp file (*.shp), you can download this file from:
    http://www.cityofchicago.org/city/en/depts/doit/dataset/school_grounds.html
    It will remove all the school grounds data and re-import this data with the new ones.
    '''
    help = 'Re-import schools data'

    def add_arguments(self, parser):
        parser.add_argument('--file')

    def remove_all_school_grounds_area(self):
        Area.objects.filter(type__icontains='school').delete()

    def update_all_non_types_to_school_grounds(self):
        Area.objects.filter(type='').update(type='school-grounds')

    def map_shape_file_to_model(self, file_path):
        mapping = {'name': 'SCHOOL_NAM', 'polygon': 'POLYGON'}
        lm = LayerMapping(Area, file_path, mapping)
        lm.save(verbose=False)

    def handle(self, *args, **options):
        self.remove_all_school_grounds_area()
        self.map_shape_file_to_model(file_path=options['file'])
        self.update_all_non_types_to_school_grounds()
