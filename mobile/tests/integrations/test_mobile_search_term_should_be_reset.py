from allegation.factories import OfficerFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSearchTermShouldBeResetTest(BaseLivePhoneTestCase):
    def search_for(self, query):
        self.until(lambda: len(self.find_all('.input-text')).should.be.greater_than(0))
        self.fill_in('.input-text', query)

    def wait_for_suggestion_list(self):
        self.until(lambda: self.find('.officer-complaint-item'))

    def get_current_search_term(self):
        return self.find('.input-text').text

    def click_on_first_result(self):
        self.find('.officer-complaint-item').click()

    def setUp(self):
        self.officer = OfficerFactory()
        self.officer_allegation = OfficerAllegationFactory()
        self.query = self.officer_allegation.allegation.crid

    def test_search_term_should_be_reset(self):
        self.visit_officer_page(self.officer.id)
        self.search_for(self.query)
        self.wait_for_suggestion_list()
        self.click_on_first_result()
        self.get_current_search_term().should.be.empty
