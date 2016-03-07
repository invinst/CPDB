from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory, OfficerFactory
from allegation.tests.utils.filter_tags_test_mixin import FilterTagsTestMixin
from common.tests.core import BaseLiveTestCase


class MobileComplaintPageRedirectTest(FilterTagsTestMixin, BaseLiveTestCase):
    def assert_current_url_is_data_tool_page(self):
        self.browser.current_url.should.contain('/data')

    def test_redirect_mobile_complaint_page_to_data_tool(self):
        allegation = AllegationFactory()

        corresponding_mobile_complaint_url = allegation.get_mobile_url()
        self.visit(corresponding_mobile_complaint_url)

        self.assert_current_url_is_data_tool_page()
        self.assert_have_filter_tags('Allegation ID', allegation.crid)


class MobileSearchPageRedirectTest(FilterTagsTestMixin, BaseLiveTestCase):
    def test_search_page_to_data_tool(self):
        officer = OfficerFactory(officer_first='John', officer_last='Henry')

        search_url = reverse('allegation:search-q-page', kwargs={'term': officer.officer_first})
        self.visit(search_url)

        self.assert_have_filter_tags('officer', officer.officer_first)

    def test_search_page_no_result_to_homepage(self):
        search_url = reverse('allegation:search-q-page', kwargs={'term': 'no_result'})

        self.visit(search_url)

        self.assert_no_filter_tags()
