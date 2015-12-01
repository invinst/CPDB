from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class SessionViewTestCase(SimpleTestCase):
    def test_get_session_by_hash(self):
        session = SessionFactory()
        response = self.client.get("/api/sessions/{hash}/".format(hash=session.hash_id))
        response.status_code.should.equal(200)
        response_json = self.json(response)
        response_json['title'].should.equal(session.title)
