from common.tests.core import BaseLiveTestCase
from allegation.tests.utils.autocomplete_test_helper_mixin import AutocompleteTestHelperMixin
from allegation.factories import OfficerAllegationFactory


class GoogleAnalyticsTest(AutocompleteTestHelperMixin, BaseLiveTestCase):
    def test_send_google_analytics_when_search(self):
        officer_allegation = OfficerAllegationFactory()
        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_track_ga_event()

    def test_filter_with_sunburst(self):
        # FIXME: add test for this
        pass

    def test_filter_by_clicking_on_map(self):
        # FIXME: add test for this
        pass

    def get_ga_call_variable(self):
        return self.browser.execute_script("return window.gaCall")
