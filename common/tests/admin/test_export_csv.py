from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase, SimpleTestCase
from share.models import Session
from share.factories import SessionFactory


class AllegationAdminTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.allegation = AllegationFactory()

    def test_see_export_option(self):
        self.visit("/admin/models/")
        self.link("Allegations").should.be.ok

        self.visit(self.link("Allegations").attrs['href'])
        self.should_see_text('Export Allegations to CSV')

        options = self.find_all(".actions select option")
        options = {o.text: o.attrs['value'] for o in options}
        options['Export Allegations to CSV'].should.equal('export_as_csv')

    def test_browse_session_admin(self):
        response = self.client.post("/admin/models/common/allegation/", {
            '_selected_action': str(self.allegation.id),
            'action': 'export_as_csv',
            'select_across': '0'
        })
        response['content-type'].should.equal('text/csv')
