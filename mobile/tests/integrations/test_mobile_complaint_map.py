from allegation.factories import AllegationFactory
from mobile.tests.integrations.test_mobile_complaint_page import \
    MobileComplaintPageTestMixin


class MobileComplaintMapTest(MobileComplaintPageTestMixin):
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
        self.go_to_allegation_detail_page(allegation.crid)

        self.assert_no_map()

    def test_have_exact_location(self):
        add1 = 123
        add2 = 'add2'
        allegation = AllegationFactory(add1=add1, add2=add2)

        self.go_to_allegation_detail_page(allegation.crid)
        self.assert_map_has_marker()

    def test_have_no_exact_location(self):
        allegation = AllegationFactory(add1=None, add2=None)
        self.go_to_allegation_detail_page(allegation.crid)
        self.assert_map_has_circle()
