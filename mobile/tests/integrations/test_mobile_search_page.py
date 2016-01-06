from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSearchPageTest(BaseLivePhoneTestCase):
    def go_to_search_page(self, query):
        self.visit('/mobile/search/{query}'.format(query=query))

    def should_see_text_in_result(self, text):
        self.find('.search-result').text.should.contain(text)

    def wait_for_success_result(self):
        self.until(lambda: self.find('.suggestion-list'))

    def wait_for_error_message(self):
        self.until(lambda: self.find('.failed-search'))

    def test_search_successful(self):
        officer = OfficerFactory()
        self.go_to_search_page(query=officer.officer_first)
        self.wait_for_success_result()

        self.should_see_text_in_result(officer.officer_first)
        self.should_see_text_in_result(officer.officer_last)

    def test_search_failed(self):
        bad_query = 'bad_query'
        self.go_to_search_page(query=bad_query)
        self.wait_for_error_message()

        self.should_see_text("Sorry, there's no results for your search in the database.")
