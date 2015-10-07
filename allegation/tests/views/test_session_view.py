import json
from unittest import mock
from django.http.request import HttpRequest
from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class AllegationSessionApiView(SimpleTestCase):
    def setUp(self):
        self.update_params = {
            'new': False,
            'hash': 'ML2dQA',
            'title': 'Chicago Police Database',
            'query': {'filters': 'some filters'},
        }

    def call_get_session_api(self, params={}):
        response = self.client.get('/api/allegations/session/', params)
        data = self.json(response)

        return response, data

    def call_post_session_api(self, params={}):
        request_params = {
            'request_data': json.dumps(params)
        }
        response = self.client.post('/api/allegations/session/', request_params)
        data = self.json(response)

        return response, data

    def test_get_new_session(self):
        response, data = self.call_get_session_api({'hash_id': ''})
        response.status_code.should.equal(200)
        data = data['data']
        data['new'].should.equal(True)

    def test_get_invalid_session(self):
        response, data = self.call_get_session_api({'hash_id': 'invalid'})
        response.status_code.should.equal(404)
        data['data'].should.contain('msg')

    def test_get_valid_session(self):
        session = SessionFactory()
        response, data = self.call_get_session_api({'hash_id': session.hash_id})
        response.status_code.should.equal(200)
        data = data['data']
        data['new'].should.equal(False)

    def test_not_in_owned_session(self):
        response, data = self.call_post_session_api(self.update_params)
        response.status_code.should.equal(400)
        data['data']['msg'].should.equal('Hash is not owned')


    def test_invalid_session(self):
        session = self.client.session
        session['owned_sessions'] = [624]
        session.save()
        response, data = self.call_post_session_api(self.update_params)
        response.status_code.should.equal(400)
        data['data']['msg'].should.equal('Session is not found')

    def test_session_not_found(self):
        self.update_params['hash'] = '123'
        response, data = self.call_post_session_api(self.update_params)
        response.status_code.should.equal(400)
        data['data']['msg'].should.equal('Hash not found')

    def test_success_update(self):
        session = self.client.session
        session['owned_sessions'] = [624]
        session.save()
        SessionFactory(id=624)
        response, data = self.call_post_session_api(self.update_params)
        response.status_code.should.equal(200)
