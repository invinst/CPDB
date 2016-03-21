from datetime import datetime

from allegation.factories import (
    OfficerAllegationFactory, OfficerFactory, ComplainingWitnessFactory,
    AllegationFactory)
from common.tests.core import BaseLiveTestCase


class RaceGenderAgeTabTestCase(BaseLiveTestCase):

    def populate_officer_data(self):
        incident_date = datetime(2000, 1, 1)
        allegation = AllegationFactory(incident_date=incident_date)
        officer_stats = [
            {'race': 'White', 'gender': 'M', 'birth_year': incident_date.year - 24},
            {'race': 'White', 'gender': 'F', 'birth_year': incident_date.year - 32},
            {'race': 'Black', 'gender': 'M', 'birth_year': incident_date.year - 41},
            {'race': 'Black', 'gender': 'F', 'birth_year': incident_date.year - 56},
            {'race': 'Hispanic', 'gender': 'X', 'birth_year': incident_date.year - 63},
        ]
        officers = [OfficerFactory(**stat) for stat in officer_stats]
        [OfficerAllegationFactory(officer=officer, allegation=allegation) for officer in officers]

    def populate_witness_data(self):
        allegation = AllegationFactory()
        witness_stats = [
            {'race': 'White', 'gender': 'M', 'age': 15},
            {'race': 'Black', 'gender': 'F', 'age': 21},
            {'race': 'Black', 'gender': 'M', 'age': 32},
            {'race': 'White', 'gender': 'F', 'age': 43},
            {'race': 'Hispanic', 'gender': 'X', 'age': 53},
        ]
        [ComplainingWitnessFactory(allegation=allegation, **stat) for stat in witness_stats]
        OfficerAllegationFactory(allegation=allegation)

    def change_to_tab(self, class_name):
        self.find('.%s' % class_name).click()

    def get_segment_labels(self, tab_id, class_name):
        return self.find_all('#%s .horizontal-percentage-chart.%s .segment-label' % (tab_id, class_name))

    def assert_segment_labels(self, expected_labels, tab_id, chart_class):
        segment_labels = self.get_segment_labels(tab_id, chart_class)
        segment_set = set()
        for ind, segment_label in enumerate(segment_labels):
            segment_set.add((
                segment_label.find('.segment-name').text,
                segment_label.find('.segment-percentage').text))
        segment_set.should.equal(set(expected_labels))

    def test_accused_race(self):
        self.populate_officer_data()
        self.visit_home()
        self.change_to_tab('accused')
        expected_labels = [('Hispanic officers', '20%'), ('White officers', '40%'), ('Black officers', '40%')]
        self.assert_segment_labels(expected_labels, 'accused', 'race')

    def test_accused_gender(self):
        self.populate_officer_data()
        self.visit_home()
        self.change_to_tab('accused')
        expected_labels = [('X', '20%'), ('Female', '40%'), ('Male', '40%')]
        self.assert_segment_labels(expected_labels, 'accused', 'gender')

    def test_accused_age(self):
        self.populate_officer_data()
        self.visit_home()
        self.change_to_tab('accused')
        expected_labels = [('61+', '20%'), ('51-60', '20%'), ('41-50', '20%'),  ('31-40', '20%'), ('20-30', '20%')]
        self.assert_segment_labels(expected_labels, 'accused', 'age')

    def test_witness_race(self):
        self.populate_witness_data()
        self.visit_home()
        self.change_to_tab('complainants')
        expected_labels = [('Hispanic', '20%'), ('White', '40%'), ('Black', '40%')]
        self.assert_segment_labels(expected_labels, 'complainants', 'race')

    def test_witness_gender(self):
        self.populate_witness_data()
        self.visit_home()
        self.change_to_tab('complainants')
        expected_labels = [('X', '20%'), ('Female', '40%'), ('Male', '40%')]
        self.assert_segment_labels(expected_labels, 'complainants', 'gender')

    def test_witness_age(self):
        self.populate_witness_data()
        self.visit_home()
        self.change_to_tab('complainants')
        expected_labels = [('51+', '20%'), ('21-30', '20%'), ('41-50', '20%'),  ('31-40', '20%'), ('<20', '20%')]
        self.assert_segment_labels(expected_labels, 'complainants', 'age')

    # TODO: add test for chart after filter

    # TODO: add test to count allegation when filter by chart
