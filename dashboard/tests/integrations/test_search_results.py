from common.tests.core import BaseLiveTestCase
from search.models.suggestion import FilterLog


class SearchResultTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def test_see_search_result_tab(self):
        self.should_see_text('Search Results')
        self.element_by_tagname_and_text('span', 'Search Results').click()
        self.button('Add Alias').should.be.ok
        # self.find("#results").should.be.ok

    # def test_see_empty_search_results(self):
    #     self.link('Search Result').click()
    #     self.find("#results").should.be.ok
    #
    # def test_see_search_results(self):
    #     FilterLogFactory()
    #     self.link('Search Result').click()
    #     results = self.find_all("#results .result")
    #     results.shouldnt.equal([])
