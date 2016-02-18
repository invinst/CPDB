from allegation.factories import OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase
from common.utils.haystack import rebuild_index
from share.models import Session
from common.tests.mixins.sunburst_chart_mixin import SunburstChartTestMixin


class ShareSessionTestCase(BaseLiveTestCase, SunburstChartTestMixin):
    def test_share_id_appended_to_url_in_home(self):
        self.visit_home()
        self.find("body").click()  # bug - firefox focus url address bar
        # http://host:port/hash/
        self.until(lambda: self.browser.current_url.count("/") >= 4)

    def test_not_generate_new_share_when_access_a_share(self):
        self.test_share_id_appended_to_url_in_home()
        session_count = Session.objects.all().count()
        url = self.browser.current_url
        self.browser.refresh()
        self.browser.current_url.should.equal(url)  # session not change
        # no new session created
        Session.objects.all().count().should.equal(session_count)

    def test_save_current_filter_in_session(self):
        officer_allegation = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.find("body").click()

        self.find(".ui-autocomplete-input").send_keys(
            officer_allegation.officer.officer_first)

        self.until(lambda: self.find(".autocomplete-officer").click())
        self.until_ajax_complete()
        self.browser.refresh()
        self.until(
            lambda: self.find("#filter-tags").text
            .should.contain(officer_allegation.officer.display_name))

    def test_display_dotted_underlining(self):
        OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.element_exist(".site-title .after-title-input").should.be.false

        # Select a filter
        self.click_on_sunburst(2)
        # Toggle share bar
        self.find('button .fa.fa-share').click()
        self.until_ajax_complete()

        self.element_exist(".site-title .after-title-input").should.be.true

        # Remove Filter
        self.click_on_sunburst(1)

        self.element_exist(".site-title .after-title-input").should.be.false
