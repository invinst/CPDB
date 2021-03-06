from faker import Faker

from common.tests.core import BaseAdminTestCase
from search.factories import SuggestionLogFactory, FilterLogFactory, SessionAliasFactory
from search.models.session_alias import SessionAlias
from share.factories import SessionFactory
from share.models import Session


fake = Faker()


class SessionManagementTestCase(BaseAdminTestCase):
    def tearDown(self):
        Session.objects.all().delete()
        super(SessionManagementTestCase, self).tearDown()

    def go_to_sessions(self):
        self.element_by_tagname_and_text('span', 'Sessions').click()
        self.until_ajax_complete()

    def test_see_sessions_management_section(self):
        session = SessionFactory()

        self.should_see_text('Sessions')
        self.go_to_sessions()
        self.find("#sessions").should.be.ok

        self.number_of_sessions().shouldnt.equal(0)
        self.should_see_text(session.hash_id)

    def test_search_in_sessions_management_section(self):
        query = 'should'
        uppercase_query = 'SHOULD'
        match_title = 'should_match'
        non_match_title = 'no_match'

        SessionFactory(title=match_title)
        SessionFactory(title=non_match_title)

        self.go_to_sessions()
        self.number_of_sessions().should.equal(2)

        self.search_for_session(query)
        self.until_ajax_complete()
        self.number_of_sessions().should.equal(1)
        self.should_see_text(match_title)

        self.search_for_session(uppercase_query)
        self.until_ajax_complete()
        self.number_of_sessions().should.equal(1)
        self.should_see_text(match_title)

    def test_see_history_of_session(self):
        category = 'category'
        session = SessionFactory()
        suggestion = SuggestionLogFactory(session_id=session.hash_id)
        FilterLogFactory(session_id=session.hash_id, tag_name='cat__category=category')

        self.go_to_sessions()
        self.find('tr.session-row').click()

        self.should_see_text(suggestion.search_query)
        self.should_see_text(category)

    def test_search_by_session_id(self):
        session = SessionFactory()
        SessionFactory()

        self.go_to_sessions()
        self.number_of_sessions().should.equal(2)

        self.search_for_session(session.hash_id)
        self.until_ajax_complete()

        self.number_of_sessions().should.equal(1)

    def create_alias(self, alias, title=None):
        self.find('.add-alias').click()
        self.until(lambda: self.find('.alias-input').is_displayed())
        self.fill_alias_form(alias, title=title)

    def fill_alias_form(self, alias, title=None, target=None):
        self.find('.alias-input').send_keys(alias)
        if title:
            self.find('.title-input').send_keys(title)
        if target:
            self.find('.target-input').send_keys(target)

        self.button('SUBMIT').click()
        self.until(lambda: self.should_see_text('Add new alias successfully'))

    def test_add_alias(self):
        alias = fake.name()
        session = SessionFactory()

        self.go_to_sessions()
        self.create_alias(alias)

        SessionAlias.objects.get(alias=alias).session.id.should.equal(session.id)

    def test_add_alias_custom_title(self):
        second_alias = fake.name()
        custom_title = fake.name()
        session = SessionFactory()

        self.go_to_sessions()
        self.create_alias(second_alias, custom_title)

        SessionAlias.objects.get(alias=second_alias, title=custom_title).session.id.should.equal(session.id)

    def number_of_sessions(self):
        return len(self.find_all("#sessions .session-row"))

    def search_for_session(self, query):
        search_input = self.find('#search_input')
        search_input.clear()
        search_input.send_keys(query)

    def test_view_session_alias(self):
        session = SessionFactory()
        session_alias = SessionAliasFactory(title=fake.name())
        SessionAliasFactory()

        self.go_to_sessions()
        self.element_by_tagname_and_text('li', 'Alias').click()
        self.until_ajax_complete()

        self.should_see_text(session_alias.session.hash_id)
        self.should_see_text(session_alias.user.username)
        self.should_see_text(session_alias.title)
        self.should_not_see_text(session.hash_id)

        row = self.find("tr.alias-row")
        row.find(".delete").click()
        alias = row.find(".alias").text

        self.until(lambda: self.should_see_text("Confirm delete alias"))
        self.button("OK").click()
        self.until_ajax_complete()

        self.until(lambda: self.should_not_see_text(alias))
        self.should_see_text('Delete alias successfully')
        SessionAlias.objects.filter(alias=alias).exists().should.be.false

    def test_add_session_alias_full_form(self):
        session = SessionFactory()
        title = 'Session title'
        alias = 'alias'
        target = 'http://localhost{path}'.format(path=session.get_absolute_url())

        self.go_to_sessions()
        self.button('Add Alias').click()
        self.until(lambda: self.should_see_text('Add Session Alias'))
        self.fill_alias_form(alias, title=title, target=target)

        session_alias = SessionAlias.objects.get(session_id=session.id)
        session_alias.alias.should.equal(alias)
        session_alias.title.should.equal(title)
