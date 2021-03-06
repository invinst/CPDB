from common.tests.core import SimpleTestCase
from search.factories import SuggestionLogFactory, FilterLogFactory
from share.factories import SessionFactory
from share.models import Session


class SessionViewTestCase(SimpleTestCase):
    def setUp(self):
        Session.objects.all().delete()
        self.login_user()

    def get_sessions(self, params={}):
        response = self.client.get('/api/dashboard/sessions/', params)
        data = self.json(response)

        return response, data

    def test_get_sessions_should_return_status_200(self):
        response, data = self.get_sessions()
        response.status_code.should.equal(200)

    def test_get_sessions_with_query_for_title_included(self):
        query = 'should'
        match_title = 'should_match'
        non_match_title = 'match'

        SessionFactory(title=match_title)
        SessionFactory(title=non_match_title)

        params = {'q': query}
        response, data = self.get_sessions(params)
        response.status_code.should.equal(200)
        len(data['results']).should.be(1)

    def test_get_sessions_with_query_for_id_included(self):
        SessionFactory()
        session = SessionFactory()

        params = {'q': session.hash_id}
        response, data = self.get_sessions(params)
        response.status_code.should.equal(200)

        len(data['results']).should.be(1)

    def test_get_details_with_session(self):
        session = SessionFactory()
        SuggestionLogFactory(session_id=session.hash_id)
        FilterLogFactory(session_id=session.hash_id)

        response, data = self.get_sessions()
        response.status_code.should.equal(200)
        len(data['results']).should.be(1)
        len(data['results'][0]['suggestion_logs']).should.be(1)
        len(data['results'][0]['filter_logs']).should.be(1)
