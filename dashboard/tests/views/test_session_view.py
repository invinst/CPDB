from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session


class SessionViewTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def tearDown(self):
        Session.objects.all().delete()

    def get_sessions(self, params={}):
        response = self.client.get('/api/dashboard/sessions/', params)
        data = self.json(response)

        return response, data

    def test_get_sessions_should_return_status_200(self):
        response, data = self.get_sessions()
        response.status_code.should.equal(200)
