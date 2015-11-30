import json

from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class SessionSearchableViewTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def test_invalid_params(self):
        response = self.client.post('/api/dashboard/session-searchable/', {})
        response.status_code.should.equal(400)

    def test_not_found_session(self):
        response = self.client.post('/api/dashboard/session-searchable/', {
            'hash_id': 'abc123',
            'enable': 1
        })
        response.status_code.should.equal(404)

    def test_success(self):
        session = SessionFactory()
        enable = 1

        response = self.client.post('/api/dashboard/session-searchable/', {
            'hash_id': session.hash_id,
            'enable': enable
        })
        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())
        data['hash_id'].should.equal(session.hash_id)
        data['enable'].should.equal(enable)
