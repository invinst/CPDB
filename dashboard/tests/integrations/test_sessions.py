from faker import Faker

from common.tests.core import BaseLiveTestCase
from search.factories import SuggestionLogFactory, FilterLogFactory, SessionAliasFactory
from search.models.session_alias import SessionAlias
from share.factories import SessionFactory
from share.models import Session


fake = Faker()


class SessionManagementTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

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
        filter_log = FilterLogFactory(session_id=session.hash_id, tag_name='cat__category=category')

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
        self.until(lambda: self.should_see_text('Add Alias'))

        self.find('.alias-input').send_keys(alias)
        if title:
            self.find('.title-input').send_keys(title)
        self.button('SUBMIT').click()
        self.until(lambda: self.should_see_text('Add new alias successfully'))

    def test_add_alias(self):
        alias = fake.name()
        session = SessionFactory()

        self.go_to_sessions()
        self.create_alias(alias)

        SessionAlias.objects.get(alias=alias).session.id.should.equal(session.id)

        second_alias = fake.name()
        custom_title = fake.name()
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
        self.should_see_text('Delete alias successfully');
        SessionAlias.objects.filter(alias=alias).exists().should.be.false
