from allegation.factories import OfficerFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSearchPageTest(BaseLivePhoneTestCase):
    def should_see_text_in_result(self, text):
        self.find('.search-results').text.should.contain(text)

    def wait_for_success_result(self):
        self.until(lambda: self.find('.suggestion-list'))

    def wait_for_error_message(self):
        self.until(lambda: self.find('.failed-search'))

    def test_search_successful(self):
        officer = OfficerFactory()
        self.visit_search_page(query=officer.officer_first)
        self.wait_for_success_result()

        self.should_see_text_in_result(officer.officer_first)
        self.should_see_text_in_result(officer.officer_last)

    def test_search_failed(self):
        bad_query = 'bad_query'
        self.visit_search_page(query=bad_query)
        self.wait_for_error_message()
        self.should_see_text("Sorry, there's no results for your search in the database.")

    def test_search_with_special_character(self):
        officer = OfficerFactory()

        query_formats = ['{first}_{last}', '{first}+{last}', '{first} {last}', '{first}-{last}']

        for query_format in query_formats:
            query = query_format.format(first=officer.officer_first, last=officer.officer_last)
            self.visit_search_page(query=query)
            self.wait_for_success_result()

            self.should_see_text_in_result(officer.officer_first)
            self.should_see_text_in_result(officer.officer_last)
