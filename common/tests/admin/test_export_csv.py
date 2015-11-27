from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase, SimpleTestCase
from share.models import Session
from share.factories import SessionFactory


class AllegationAdminLiveTestCase(BaseLiveTestCase):
    def test_browse_session_admin(self):
        self.login_user()
        allegation = AllegationFactory()
        self.visit("/admin/models/")

        self.link("Allegations").click()
        self.find("#action-toggle").click()

        self.find(".actions select").select_by_visible_text('Export Allegations to CSV')
        self.find(".actions select").get_attribute('value').should.equal('export_as_csv')


class AllegationAdminTestCase(SimpleTestCase):
    def test_browse_session_admin(self):
        self.login_user()
        allegation = AllegationFactory()
        response = self.client.post("/admin/models/common/allegation/", {
            '_selected_action': str(allegation.id),
            'action': 'export_as_csv',
            'select_across': '0'
        })
        response['content-type'].should.equal('text/csv')
