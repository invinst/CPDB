from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase
from share.models import Session


class ActiveOfficerTestCase(BaseLiveTestCase):
    def test_change_filter_clear_active_officers(self):
        allegation = AllegationFactory()
        self.visit_home()
        self.click_first_officer()

        self.click_active_tab('Categories')
        self.until(lambda: self.link(allegation.cat.category).click())
        self.until_ajax_complete()

        session_hash = self.browser.current_url.split("/")[4]
        session = Session.objects.get(id=Session.id_from_hash(session_hash)[0])
        session.query['active_officers'].should.be.empty
