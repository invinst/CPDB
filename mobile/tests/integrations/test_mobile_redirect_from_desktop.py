from allegation.tests.utils.autocomplete_test_helper_mixin import AutocompleteTestHelperMixin
from common.tests.core import BaseLiveTestCase


class MobileRedirectFromDesktopTest(AutocompleteTestHelperMixin, BaseLiveTestCase):
    def mobile_url_for_current_request(self):
        return self.browser.current_url.replace('data', 'mobile/data')
