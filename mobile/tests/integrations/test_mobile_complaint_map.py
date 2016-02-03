from allegation.factories import AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileComplaintMapTest(BaseLivePhoneTestCase):
    def assert_map_has_marker(self):
        len(self.find_all('.map .leaflet-marker-icon')).should.be.equal(1)

    def assert_map_has_circle(self):
        len(self.find_all('.map .leaflet-overlay-pane svg')).should.be.equal(1)

    def assert_no_map(self):
        len(self.find_all('.map')).shouldnt.be.equal(0)

    def test_no_map(self):
        allegation = AllegationFactory(
            add1=None, add2=None, beat=None, city=None,
            location=None, point=None)
        OfficerAllegationFactory(allegation=allegation)
        self.visit_complaint_page(allegation)

        self.assert_no_map()

    def test_have_exact_location(self):
        add1 = 123
        add2 = 'add2'
        allegation = AllegationFactory(add1=add1, add2=add2)
        OfficerAllegationFactory(allegation=allegation)
        self.visit_complaint_page(allegation)
        self.assert_map_has_marker()

    def test_have_no_exact_location(self):
        allegation = AllegationFactory(add1=None, add2=None)
        OfficerAllegationFactory(allegation=allegation)
        self.visit_complaint_page(allegation)
        self.assert_map_has_circle()
