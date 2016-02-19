from common.tests.core import SimpleTestCase
from search.factories import SessionAliasFactory
from share.factories import SessionFactory


class SessionAliasViewTestCase(SimpleTestCase):
    def setUp(self):
        super(SessionAliasViewTestCase, self).setUp()
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

    def test_search_by_hash(self):
        session = SessionFactory()
        SessionAliasFactory(session=session)
        SessionAliasFactory()

        response = self.client.get('/api/dashboard/session-alias2/', {
            'q': session.hash_id,
        })
        self.response_contain_session(response, session)

    def response_contain_session(self, response, session):
        data = self.json(response)
        data.should.contain('results')
        data['results'].should.be.a(list)
        data['results'].should.have.length_of(1)

        found = data['results'][0]
        found['session']['hash_id'].should.equal(session.hash_id)

    def test_search_by_title(self):
        session = SessionFactory()
        SessionAliasFactory(session=session)
        SessionAliasFactory()

        response = self.client.get('/api/dashboard/session-alias2/', {
            'q': session.title[:3],
        })
        self.response_contain_session(response, session)
