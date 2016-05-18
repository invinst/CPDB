from django.contrib.gis.geos import Point
from mock import MagicMock

from allegation.factories import AreaFactory, AllegationFactory
from common.management.commands.increase_school_radius import Command
from common.models import Allegation
from common.tests.core import SimpleTestCase


class IncreaseSchoolRadiusTest(SimpleTestCase):
    def setUp(self):
        self.command = Command()

    def test_remove_all_school_grounds_from_allegation(self):
        area = AreaFactory(type='school-grounds')
        allegation = AllegationFactory(areas=[area])
        Allegation.objects.get(pk=allegation.pk).areas.filter(type='school-grounds').shouldnt.have.length_of(0)
        self.command.remove_all_school_grounds_from_allegation()
        Allegation.objects.get(pk=allegation.pk).areas.filter(type='school-grounds').should.have.length_of(0)

    def test_assign_school_grounds_to_allegation(self):
        area = AreaFactory(type='school-grounds')
        allegation = AllegationFactory(point=Point(area.polygon.centroid.x, area.polygon.centroid.y))
        other_allegation = AllegationFactory(point=Point(area.polygon.centroid.x + 200, area.polygon.centroid.y))
        allegation.areas.remove(*allegation.areas.all())
        other_allegation.areas.remove(*other_allegation.areas.all())

        Allegation.objects.get(pk=allegation.pk).areas.filter(type='school-grounds').should.have.length_of(0)
        Allegation.objects.get(pk=other_allegation.pk).areas.filter(type='school-grounds').should.have.length_of(0)

        self.command.assign_school_grounds_to_allegation(radius=100)

        areas = Allegation.objects.get(pk=allegation.pk).areas
        areas.filter(type='school-grounds').shouldnt.have.length_of(0)
        areas.values_list('id', flat=True).should.contain(area.id)

        other_allegation_areas = Allegation.objects.get(pk=other_allegation.pk).areas
        other_allegation_areas.filter(type='school-grounds').should.have.length_of(0)

    def test_handle(self):
        self.command.remove_all_school_grounds_from_allegation = MagicMock()
        self.command.assign_school_grounds_to_allegation = MagicMock()

        self.command.handle()

        self.command.remove_all_school_grounds_from_allegation.called.should.equal(True)
        self.command.assign_school_grounds_to_allegation.called.should.equal(True)
