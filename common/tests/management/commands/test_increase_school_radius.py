from django.contrib.gis.geos.collections import MultiPolygon
from django.contrib.gis.geos.point import Point
from django.contrib.gis.geos.polygon import Polygon
from django.core import management

from allegation.factories import AreaFactory, AllegationFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation


class TestSchoolRadius(SimpleTestCase):

    def test_radius(self):
        polygon = MultiPolygon(Polygon(((87.940101, 42.023135),
                                        (87.93, 42.023135),
                                        (87.93, 42),
                                        (87.940101, 42),
                                        (87.940101, 42.023135))))
        area = AreaFactory(type='school-grounds', polygon=polygon)
        point = Point(87.940102, 42.023136) #just outside of area polygon
        allegation = AllegationFactory(point=point)
        allegation.areas.filter(pk=area.pk).exists().should.equal(False)
        #import pdb; pdb.set_trace()

        management.call_command('increase_school_radius', radius=1500)
        
        allegation = Allegation.objects.get(pk=allegation.pk)
        allegation.areas.filter(pk=area.pk).exists().should.equal(True)
