from django.contrib.gis.geos import Point
from mock import patch

from allegation.factories import AllegationFactory, OfficerFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation


class AllegationManager(SimpleTestCase):
    def setUp(self):
        pass

    def test_by_officer_names(self):
        self.create_allegation_with_officer_name('Kevin')
        self.create_allegation_with_officer_name('SomeThingNotKevin')

        number_of_officer_by_names = Allegation.allegations.by_officer_names(['Kevin']).count()
        self.assertEqual(number_of_officer_by_names, 1)

    def test_by_latlng(self):
        self.create_allegation_with_latlng((100, 100))
        self.create_allegation_with_latlng((800, 800))

        number_of_officer_by_latlng = Allegation.allegations.by_latlng([100, 100], radius=500).count()
        self.assertEqual(number_of_officer_by_latlng, 1)

    @patch('allegation.views.allegation_query_filter.AllegationQueryFilter')
    def test_by_allegation_filter(self, mock_allegation_filter):
        officer = OfficerFactory()
        AllegationFactory(officer=officer)
        for i in range(1, 10):
            AllegationFactory()

        conditions = []
        filters = {'officer': officer.id}

        mock_allegation_filter.return_value.allegation_filters.return_value = (conditions, filters)

        number_of_officer_by_allegation_filters = Allegation.allegations.by_allegation_filter(mock_allegation_filter([], [])).count()
        self.assertEqual(number_of_officer_by_allegation_filters, 1)

    def create_allegation_with_latlng(self, latlng):
        lat, lng = latlng
        point = Point(float(lat), float(lng))
        AllegationFactory(point=point)

    def create_allegation_with_officer_name(self, name):
        AllegationFactory(officer=OfficerFactory(officer_first=name, officer_last=name))
