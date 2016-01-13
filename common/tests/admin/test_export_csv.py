from allegation.factories import OfficerAllegationFactory
from common.tests.core import SimpleTestCase


class OfficerAllegationAdminTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.officer_allegation = OfficerAllegationFactory()

    def test_see_export_option(self):
        self.visit("/admin/models/")
        self.link("Officer allegations").should.be.ok

        self.visit(self.link("Officer allegations").attrs['href'])
        self.should_see_text('Export Officer allegations to CSV')

        options = self.find_all(".actions select option")
        options = {o.text: o.attrs['value'] for o in options}
        options['Export Officer allegations to CSV']\
            .should.equal('export_as_csv')

    def test_browse_session_admin(self):
        response = self.client.post(
            "/admin/models/common/officerallegation/", {
                '_selected_action': str(self.officer_allegation.id),
                'action': 'export_as_csv',
                'select_across': '0'
            })
        response['content-type'].should.equal('text/csv')
