from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase
from share.models import Session


class ShareSessionTestCase(BaseLiveTestCase):
    def test_share_id_appended_to_url_in_home(self):
        self.visit_home()
        self.find("body").click()  # bug - firefox focus url address bar
        self.until(lambda: self.browser.current_url.count("/") >= 4)  # http://host:port/hash/

    def test_not_generate_new_share_when_access_a_share(self):
        self.test_share_id_appended_to_url_in_home()
        session_count = Session.objects.all().count()
        url = self.browser.current_url
        self.browser.refresh()
        self.browser.current_url.should.equal(url)  # session not change
        Session.objects.all().count().should.equal(session_count)  # no new session created

    def test_save_current_filter_in_session(self):
        self.visit_home()
        self.find("body").click()

        allegation = AllegationFactory()
        self.find(".ui-autocomplete-input").send_keys(allegation.officer.officer_first)

        self.until(lambda: self.find(".autocomplete-officer").click())
        self.until_ajax_complete()
        self.browser.refresh()
        self.until(lambda: self.find("#filter-tags").text.should.contain(allegation.officer.display_name))
