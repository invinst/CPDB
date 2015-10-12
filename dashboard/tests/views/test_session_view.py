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

    def test_get_sessions_with_query_for_title_included(self):
        query = 'should'
        match_title = 'should_match'
        non_match_title = 'match'

        SessionFactory(title=match_title)
        SessionFactory(title=non_match_title)

        params = { 'q': query }
        response, data = self.get_sessions(params)
        response.status_code.should.equal(200)
        len(data['results']).should.be(1)
