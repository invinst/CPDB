from allegation.factories import OfficerFactory, AllegationFactory, OfficerAllegationFactory, AllegationCategoryFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSearchablePageTest(BaseLivePhoneTestCase):
    def show_error_when_search_bad_query(self):
        bad_query = 'bad_query'
        self.search_for(bad_query)
        self.until(lambda: self.should_see_text("Sorry, there's no results for your search in the database."))

    def search_for(self, query):
        self.until(lambda: len(self.find_all('.input-text')) > 0)
        self.fill_in('.input-text', query)

    def setUp(self):
        self.officer = OfficerFactory()
        self.allegation = AllegationFactory()
        self.cat = AllegationCategoryFactory()
        self.officer_allegation = OfficerAllegationFactory(officer=self.officer, allegation=self.allegation,
                                                           cat=self.cat)

    def test_good_data(self):
        self.visit_officer_page(self.officer.id)
        self.search_for(self.officer.officer_first)
        self.until(lambda: self.should_see_text(self.officer.display_name))

        self.visit_complaint_page(self.allegation.crid, self.cat.id)
        self.search_for(self.allegation.crid)
        self.until(lambda: self.should_see_text(self.officer_allegation.cat.category))

    def test_bad_data(self):
        self.visit_officer_page(self.officer.id)
        self.show_error_when_search_bad_query()

        self.visit_complaint_page(self.allegation.crid, self.cat.id)
        self.show_error_when_search_bad_query()
