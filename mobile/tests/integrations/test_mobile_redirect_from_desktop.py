from allegation.factories import OfficerFactory
from allegation.tests.utils.autocomplete_test_helper_mixin import AutocompleteTestHelperMixin
from common.tests.core import BaseLiveTestCase
from common.utils.haystack import rebuild_index
from mobile.utils.mobile_url_builder import MobileUrlBuilder


class MobileRedirectFromDesktopTest(AutocompleteTestHelperMixin, BaseLiveTestCase):
    def test_redirect(self):
        officer = OfficerFactory()

        rebuild_index()
        self.visit('/')
        self.search_officer(officer)
        self.visit(self.mobile_url_for_current_request())
        self.until(lambda: MobileUrlBuilder().officer_page(officer) in self.browser.current_url)

    def mobile_url_for_current_request(self):
        return self.browser.current_url.replace('data', 'mobile/data')
