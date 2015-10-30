from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase


class SearchUITestCase(BaseLiveTestCase):
    def setUp(self):
        Officer.objects.all().delete()

    def test_search_box_displayed_on_home_page(self):
        self.visit('/#!/data-tools')
        self.until(lambda: self.find_all('#filter-tags'))
        len(self.find_all('#filter-tags')).should.equal(1)

    def test_display_suggestions_upon_typing(self):
        officer = OfficerFactory(officer_first='Jerry')

        self.visit('/#!/data-tools')
        search_text = 'Je'
        self.until(lambda: self.find('.ui-autocomplete-input').send_keys(search_text))
        self.until(lambda: self.should_see_text(search_text))
        self.until(lambda: self.should_see_text(officer.officer_last))
