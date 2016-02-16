from selenium.webdriver.common.keys import Keys

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase
from common.utils.haystack import rebuild_index


class SearchUITestCase(BaseLiveTestCase):
    def setUp(self):
        Officer.objects.all().delete()

    def test_search_box_displayed_on_home_page(self):
        self.visit('/#!/data-tools')
        self.until(lambda: self.find_all('#filter-tags'))
        len(self.find_all('#filter-tags')).should.equal(1)

    def test_display_suggestions_upon_typing(self):
        officer = OfficerFactory(officer_first='Jerry')
        OfficerFactory(officer_first='Jee')

        rebuild_index()

        self.visit('/?no_disclaimer=1#!/data-tools')
        search_text = 'Je'
        self.until(lambda: self.find('.ui-autocomplete-input').send_keys(search_text))
        self.until(lambda: self.should_see_text(search_text))
        self.until(lambda: self.should_see_text(officer.officer_last))

        self.find('.ui-autocomplete-input').send_keys(Keys.ARROW_DOWN)
        self.find('.ui-autocomplete-input').get_attribute('value').should.equal(search_text)

    def test_officer_and_investigator_name_displayed_as_in_database(self):
        officer = OfficerFactory(officer_last='III')
        investigator = InvestigatorFactory(name='IIII')

        rebuild_index()

        search_text = 'ii'
        self.until(lambda: self.fill_in('.ui-autocomplete-input', search_text))
        self.until(lambda: self.find('.ui-autocomplete-input').get_attribute('value').should.equal(search_text))
        self.until(lambda: self.should_see_text(officer.officer_last))
        self.until(lambda: self.should_see_text(investigator.name))
