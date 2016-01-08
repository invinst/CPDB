from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileMainPageTest(BaseLivePhoneTestCase):
    def go_to_main_page(self):
        self.visit('/mobile')

    def search_for(self, query):
        self.fill_in('.input-text', query)

    def should_see_text_in_result(self, text):
        self.find('.search-result').text.should.contain(text)

    def wait_for_success_result(self):
        self.until(lambda: self.find('.suggestion-list'))

    def wait_for_error_message(self):
        self.until(lambda: self.find('.failed-search'))

    def test_search_officer_name_failed(self):
        something_never_successful = 'something always failed'
        self.go_to_main_page()
        self.search_for(something_never_successful)
        self.wait_for_error_message()
        self.should_see_text("Sorry, there's no results for your search in the database.")

    def test_search_officer_name_successfully(self):
        officer = OfficerFactory()

        self.go_to_main_page()
        self.search_for(officer.officer_first)
        
        self.wait_for_success_result()

        self.should_see_text_in_result(officer.officer_first)
        self.should_see_text_in_result(officer.officer_last)

    def test_search_officer_badge(self):
        badge = '1234567'
        a_part_of_badge = '123'
        OfficerFactory(star=badge)

        self.go_to_main_page()

        self.search_for(a_part_of_badge)
        self.wait_for_error_message()
        self.should_see_text_in_result('No matches yet.')

        self.search_for(badge)
        self.wait_for_success_result()

        self.should_see_text_in_result('Badge')
        self.should_see_text_in_result(badge)

    def test_search_for_crid(self):
        crid = '1234567'
        a_part_of_crid = '123'
        allegation = AllegationFactory(crid=crid)

        self.go_to_main_page()
        self.search_for(a_part_of_crid)
        self.wait_for_error_message()
        self.should_see_text_in_result('No matches yet.')

        self.search_for(crid)
        self.wait_for_success_result()
        self.should_see_text_in_result('CRID')
        self.should_see_text_in_result(crid)

        self.should_see_text_in_result(allegation.cat.allegation_name)
        self.should_see_text_in_result(allegation.cat.category)
