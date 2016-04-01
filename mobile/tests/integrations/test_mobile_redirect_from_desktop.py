# from allegation.factories import OfficerFactory
from allegation.tests.utils.autocomplete_test_helper_mixin import AutocompleteTestHelperMixin
from common.tests.core import BaseLiveTestCase
# from common.utils.haystack import rebuild_index


class MobileRedirectFromDesktopTest(AutocompleteTestHelperMixin, BaseLiveTestCase):
    # NOTE: Disable until we fixed it in next commit
    # def test_redirect(self):
    #     officer = OfficerFactory()
    #
    #     rebuild_index()
    #     # FIXME: this seems to be a wrong test, please fix!
    #     self.visit('/')
    #     self.search_officer(officer)
    #     self.visit(self.mobile_url_for_current_request())
    #     self.until(lambda: officer.get_mobile_url() in self.browser.current_url)

    def mobile_url_for_current_request(self):
        return self.browser.current_url.replace('data', 'mobile/data')
