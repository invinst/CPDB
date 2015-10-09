from common.tests.core import BaseLiveTestCase
from share.factories import SessionFactory
from share.models import Session


class SessionManagementTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def tearDown(self):
        Session.objects.all().delete()
        super(SessionManagementTestCase, self).tearDown()

    def go_to_sessions(self):
        self.element_by_tagname_and_text('span', 'Sessions').click()

    def test_see_sessions_management_section(self):
        session = SessionFactory()

        self.should_see_text('Sessions')
        self.go_to_sessions()
        self.find("#sessions").should.be.ok
        results = self.find_all("#sessions .session-row")

        len(results).shouldnt.equal(0)
        self.should_see_text(session.hash_id)
