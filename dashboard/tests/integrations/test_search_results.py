from common.tests.core import BaseAdminTestCase
from search.factories import SuggestionLogFactory, AliasFactory
from search.models.alias import Alias


class SearchResultTestCase(BaseAdminTestCase):
    def tearDown(self):
        Alias.objects.all().delete()
        super(SearchResultTestCase, self).tearDown()

    def go_to_search_result(self):
        self.element_by_tagname_and_text('span', 'Search Results').click()
        self.until(lambda: self.element_by_tagname_and_text('h1', 'Search Results').is_displayed())

    def test_see_search_result_tab(self):
        log = SuggestionLogFactory()

        self.should_see_text('Search Results')
        self.go_to_search_result()
        self.button('Add Alias').should.be.ok
        self.find("#queries").should.be.ok
        results = self.find_all("#queries .query")

        len(results).shouldnt.equal(0)
        self.should_see_text(log.search_query)
        self.should_see_text(log.num_suggestions)
        self.should_see_text(1)

    def test_add_alias(self):
        self.try_to_create_new_alias()

        self.until(lambda: self.should_see_text("Add new alias successfully"))
        self.until(lambda: self.find(".modal").is_displayed().should.be.false)

        Alias.objects.filter(alias="alias", target="target").count().should.equal(1)

    def test_existing_alias(self):
        alias = AliasFactory()
        self.try_to_create_new_alias(alias.alias, alias.target)
        self.until(lambda: self.should_see_text("Alias with this Alias and Target already exists"))
        self.until(lambda: self.find(".modal").is_displayed().should.be.false)

    def try_to_create_new_alias(self, alias='alias', target='target'):
        self.go_to_search_result()
        self.button('Add Alias').click()
        self.until(lambda: self.find(".modal").is_displayed())
        self.find(".modal").text.should.contain("Add Alias")

        self.find("input[name='alias']").send_keys(alias)
        self.find("input[name='target']").send_keys(target)
        self.button("SUBMIT").click()

    def test_filter_fail_attemps(self):
        log = SuggestionLogFactory(num_suggestions=0)
        log1 = SuggestionLogFactory(num_suggestions=1)
        self.go_to_search_result()
        self.element_by_tagname_and_text('li', "Fail attempts").click()
        self.until(lambda: self.should_see_text(log.search_query))
        self.should_not_see_text(log1.search_query)

    def test_filter_alias(self):
        log = SuggestionLogFactory(num_suggestions=0)
        alias = AliasFactory()
        self.go_to_search_result()
        self.element_by_tagname_and_text('li', "Alias").click()
        self.until(lambda: self.should_see_text(alias.alias))
        self.should_not_see_text(log.search_query)

    def test_add_alias_from_query(self):
        SuggestionLogFactory()
        self.go_to_search_result()

        row = self.find(".query")
        row.find(".add-alias").click()
        self.until(lambda: self.find(".modal").is_displayed())
        self.find("input[name='alias']").get_attribute("value").should.equal(row.find("td").text)
