from allegation.factories import OfficerFactory, AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileGoogleAnalyticsTest(BaseLivePhoneTestCase):
    def setUp(self):
        self.officer = OfficerFactory()
        self.allegation = AllegationFactory()
        OfficerAllegationFactory(officer=self.officer, allegation=self.allegation)

    def test_send_google_analytics_when_view_officer_page(self):
        self.visit_officer_page(self.officer)
        self.should_track_ga_event()

    def test_send_google_analytics_when_view_complaint_page(self):
        self.visit_complaint_page(self.allegation)
        self.should_track_ga_event()

    def test_send_google_analytics_when_search_officer(self):
        self.visit_mobile_home()
        self.fill_in('.input-text', self.officer.officer_first)
        self.until(lambda: self.find('.suggestion-list'))
        self.find('.officer-name-results').click()
        self.should_track_ga_event()

    def test_send_google_analytics_when_search_complaint(self):
        self.visit_mobile_home()
        self.fill_in('.input-text', self.allegation.crid)
        self.until(lambda: self.find('.suggestion-list'))
        self.find('.complaint-results').click()
        self.should_track_ga_event()
