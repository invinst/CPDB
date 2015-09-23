from allegation.factories import OfficerFactory
from common.tests.core import BaseLiveTestCase
from search.factories import SuggestionLogFactory, AliasFactory
from search.models.alias import Alias


class SearchResultTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def tearDown(self):
        Alias.objects.all().delete()
        super(SearchResultTestCase, self).tearDown()

    def go_to_officer_profile(self):
        self.element_by_tagname_and_text('span', 'Officer Profiles').click()

    def test_see_officer_tab(self):
        self.should_see_text('Officer Profiles')
        self.go_to_officer_profile()
        self.find("h1").text.should.equal('Officer Profile')
        self.should_see_text('Please search officer to start adding stories')
        self.find("#search-officer input").should.be.ok

    def test_search_officer(self):
        officer = OfficerFactory()
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.until(lambda: self.should_see_text(officer.officer_last))
        self.should_see_text(officer.id)
        self.should_see_text(officer.gender)
        self.should_see_text(officer.race)
