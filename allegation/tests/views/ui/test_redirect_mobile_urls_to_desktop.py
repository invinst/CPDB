from allegation.factories import AllegationFactory
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
