from allegation.factories import OfficerFactory, AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSearchTeamShouldBeResetTest(BaseLivePhoneTestCase):

    def search_for(self, query):
        self.fill_in('.input-text', query)

    def wait_complaint_page_loaded(self):
        self.until(lambda: self.find('.complaint-page'))

    def get_current_search_term(self):
        return self.find('.input-text').text

    def click_on_first_result(self):
        self.find('.suggestion-list li').click()

    def setUp(self):
        self.officer = OfficerFactory()
        self.allegation = AllegationFactory()
        OfficerAllegationFactory(officer=self.officer, allegation=self.allegation)
        self.officer_page = '/mobile/officer/{slug}/{id}'.format(slug=self.officer.display_name, id=self.officer.id)
        self.query = self.allegation.crid

    def test_search_term_should_be_reset(self):
        self.visit(self.officer_page)
        self.search_for(self.query)
        self.click_on_first_result()
        self.wait_complaint_page_loaded()
        self.get_current_search_term().should.be.empty
