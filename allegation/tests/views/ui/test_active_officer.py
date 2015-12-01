from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase
from share.models import Session


class ActiveOfficerTestCase(BaseLiveTestCase):
    def test_change_filter_clear_active_officers(self):
        allegation = AllegationFactory()
        self.visit_home()
        self.find('.officer .checkmark').click()
        self.until_ajax_complete()

        self.link("Categories").click()
        self.until(lambda: self.link(allegation.cat.category).click())
        self.until_ajax_complete()

        session_hash = self.browser.current_url.split("/")[4]
        session = Session.objects.get(id=Session.id_from_hash(session_hash))
        session.query['active_officers'].should.be.empty
