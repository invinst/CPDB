from allegation.factories import (
    AllegationCategoryFactory, OfficerAllegationFactory)
from allegation.tests.utils.outcome_filter import \
    number_of_all_created_complaints
from allegation.services.outcome_analytics import FILTERS
from common.tests.core import BaseLiveTestCase
from common.models import OfficerAllegation
from search.factories import SessionAliasFactory
from share.factories import SessionFactory
from share.models import Session


class AllegationFilterTestCase(BaseLiveTestCase):
    def setUp(self):
        super(AllegationFilterTestCase, self).setUp()
        self.allegation_category = AllegationCategoryFactory()
        for _filter in FILTERS:
            for final_finding in FILTERS[_filter]:
                # Make sure it doesn't break the disciplined test
                OfficerAllegationFactory(
                    final_finding=final_finding, cat=self.allegation_category,
                    final_outcome_class='disciplined')

        self.visit_home()
        self.hide_chat_box()

    def hide_chat_box(self):
        self.browser.execute_script('jQuery("#hfc-cleanslate").hide();')

    def test_filter_by_final_finding(self):
        # Check all
        self.link("Categories").click()
        self.until(
            lambda: self.link(self.allegation_category.category).click())
        self.until(lambda: self.element_exist('.complaint-row'))
        self.number_of_complaints().should.equal(
            number_of_all_created_complaints())

        # On each filter
        for filter_text in FILTERS:
            self.element_by_tagname_and_text(
                'span', filter_text, parent=".filters").click()
            self.until(self.ajax_complete)
            number_of_final_findings = len(FILTERS[filter_text])
            self.number_of_complaints().should.equal(number_of_final_findings)

        self.element_by_tagname_and_text('span', 'Disciplined').click()
        self.until(self.ajax_complete)
        self.number_of_complaints().should.equal(
            OfficerAllegation.objects.filter(
                final_outcome_class='disciplined').count())

    def test_suggest_repeater(self):
        self.fill_in('#autocomplete', 'rep')
        self.until(
            lambda: self.element_by_classname_and_text(
                'ui-autocomplete-category', 'Repeater').should.be.ok)

    def test_suggest_session_alias(self):
        alias = 'alias'
        query = alias[:3]
        not_searchable = SessionFactory(title='not searchable')
        session = SessionFactory(title='searchable')
        SessionAliasFactory(alias=alias, session=session)

        self.fill_in('#autocomplete', query)
        self.until(
            lambda: self.element_by_classname_and_text(
                'autocomplete-session', session.title).should.be.ok)
        self.element_by_classname_and_text(
            'autocomplete-session', not_searchable.title).shouldnt.be.ok

    def test_go_to_suggested_session(self):
        alias = 'alias'
        query = alias[:3]
        session = SessionFactory()
        SessionAliasFactory(alias=alias, session=session)

        current_url = self.browser.current_url

        self.find('#autocomplete').send_keys(query)
        self.until(lambda: self.find('.autocomplete-session').click())
        self.until(lambda: self.browser.current_url != current_url)

        cloned_session = Session.objects.get(share_from=session)
        self.browser.current_url.should.contain(cloned_session.hash_id)

    def test_filter_by_repeater(self):

        self.find('#autocomplete').send_keys('rep')
        self.until(
            lambda: self.find('.autocomplete-officer__allegations_count__gt')
            .click())
        self.until(lambda: self.find('.filter-name').should.be.ok)
        self.find('.filter-name').text.should.contain('Repeater')

    def test_no_matches_found_message(self):
        self.fill_in('#autocomplete', 'search query that return nothing')
        self.until(lambda: self.should_see_text('No matches found'))

    def test_sugggest_has_document(self):
        self.fill_in('#autocomplete', 'has:doc')
        self.until(
            lambda: self.element_by_classname_and_text(
                'ui-autocomplete-category', 'has:').should.be.ok)
        self.until(
            lambda: self.element_by_classname_and_text(
                'autocomplete-has_filters', 'has:document').should.be.ok)

    def test_has_document_filter(self):
        self.fill_in('#autocomplete', 'has:document')
        self.until(lambda: self.find('.autocomplete-has_filters').click())
        self.until(
            lambda: self.element_by_classname_and_text(
                'filter-name', 'has:document').should.be.ok)

    def number_of_complaints(self):
        return len(self.find_all('.complaint-row'))
