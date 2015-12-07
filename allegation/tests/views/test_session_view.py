import json
from unittest import mock

from django.http.request import HttpRequest
from faker import Faker

from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session


fake = Faker()


class AllegationSessionApiView(SimpleTestCase):
    def setUp(self):
        self.update_params = {
            'new': False,
            'hash': 'ML2dQA',
            'title': 'Chicago Police Database',
            'query': {'filters': {}},
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

    def get_session_from_data(self, data):
        session_id = Session.id_from_hash(data['hash'])[0]
        return Session.objects.get(id=session_id)

    def test_get_new_session(self):
        response, data = self.call_get_session_api({'hash_id': ''})
        response.status_code.should.equal(200)
        data = data['data']

        data['new'].should.equal(True)

        session = self.get_session_from_data(data)
        session.ip.should.equal('127.0.0.1')

    def test_get_new_session_with_proxy(self):
        ip = fake.ipv4()
        response = self.client.get('/api/allegations/session/', HTTP_X_FORWARDED_FOR=ip)
        data = self.json(response)
        data = data['data']
        session = self.get_session_from_data(data)
        session.ip.should.equal(ip)

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

    def test_update_active_tab(self):
        Session.objects.all().delete();
        active_tab = 'map'
        update_params = self.update_params.copy()
        update_params['active_tab'] = active_tab

        session = self.client.session
        session['owned_sessions'] = [624]
        session.save()
        SessionFactory(id=624)

        response, data = self.call_post_session_api(update_params)
        Session.objects.get(pk=624).active_tab.should.equal(active_tab)
