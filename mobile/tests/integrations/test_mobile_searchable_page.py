from allegation.factories import OfficerFactory, AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSearchablePageTest(BaseLivePhoneTestCase):
    def go_to_detail_page(self, link):
        self.visit(link)

    def search_for(self, query):
        self.fill_in('.input-text', query)

    def setUp(self):
        self.officer = OfficerFactory()
        self.allegation = AllegationFactory()
        OfficerAllegationFactory(officer=self.officer, allegation=self.allegation)
        self.officer_page = '/mobile/officer/{slug}/{id}'.format(slug=self.officer.display_name, id=self.officer.id)
        self.complaint_page = '/mobile/complaint/{crid}'.format(crid=self.allegation.crid)

    def test_good_data(self):
        for page in [self.officer_page, self.complaint_page]:
            self.go_to_detail_page(page)
            self.search_for(self.officer.officer_first)
            self.until(lambda: self.should_see_text(self.officer.display_name))

    def test_bad_data(self):
        bad_query = 'bad_query'
        for page in [self.officer_page, self.complaint_page]:
            self.go_to_detail_page(page)
            self.search_for(bad_query)
            self.until(lambda: self.should_see_text("Sorry, there's no results for your search in the database."))
