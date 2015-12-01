from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session


class SessionAliasViewTestCase(SimpleTestCase):
    def setUp(self):
        Session.objects.all().delete()
        self.login_user()

    def test_invalid_params(self):
        response = self.client.post('/api/dashboard/session-alias/', {})
        response.status_code.should.equal(400)

    def test_not_found_session(self):
        response = self.client.post('/api/dashboard/session-alias/', {
            'alias': 'alias',
            'target': -1,
        })
        response.status_code.shouldnt.equal(201)

    def test_add_alias_success(self):
        session = SessionFactory()

        response = self.client.post('/api/dashboard/session-alias/', {
            'alias': 'alias',
            'target': session.id,
        })
        response.status_code.should.equal(201)
