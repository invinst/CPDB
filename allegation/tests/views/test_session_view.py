import json
from urllib.parse import urlencode

from faker import Faker

from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session
from search.models import FilterLog


fake = Faker()


class AllegationSessionApiView(SimpleTestCase):
    def setUp(self):
        super(AllegationSessionApiView, self).setUp()
        self.update_params = {
            'new': False,
            'hash': 'ML2dQA',  # id = 624
            'title': 'Chicago Police Database',
            'query': {'filters': {}},
        }

    def init_session(self):
        self.db_session = SessionFactory()

        session = self.client.session
        session['owned_sessions'] = [self.db_session.id]
        session.save()

        self.update_params['hash'] = self.db_session.hash_id

    def call_get_session_api(self, params={}):
        response = self.client.get('/api/allegations/session/', params)
        data = self.json(response)

        return response, data

    def call_put_session_api(self, params={}):
        request_params = {
            'request_data': json.dumps(params)
        }
        response = self.client.put(
            '/api/allegations/session/', urlencode(request_params))
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
        response = self.client.get(
            '/api/allegations/session/', HTTP_X_FORWARDED_FOR=ip)
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
        response, data = self.call_get_session_api(
            {'hash_id': session.hash_id})
        response.status_code.should.equal(200)
        data = data['data']
        data['new'].should.equal(False)

    def test_not_in_owned_session(self):
        response, data = self.call_put_session_api(self.update_params)
        response.status_code.should.equal(400)
        data['data']['msg'].should.equal('Hash is not owned')

    def test_invalid_session(self):
        session = self.client.session
        session['owned_sessions'] = [624]
        session.save()

        response, data = self.call_put_session_api(self.update_params)
        response.status_code.should.equal(400)
        data['data']['msg'].should.equal('Session is not found')

    def test_session_not_found(self):
        self.update_params['hash'] = '123'
        response, data = self.call_put_session_api(self.update_params)
        response.status_code.should.equal(400)
        data['data']['msg'].should.equal('Hash not found')

    def test_success_update(self):
        self.init_session()

        response, data = self.call_put_session_api(self.update_params)
        response.status_code.should.equal(200)

    def test_update_active_tab(self):
        self.init_session()

        active_tab = 'map'
        update_params = self.update_params.copy()
        update_params['active_tab'] = active_tab

        response, data = self.call_put_session_api(update_params)
        Session.objects.get(
            pk=self.db_session.id).active_tab.should.equal(active_tab)

    def test_tracking_filter(self):
        self.num_of_filter_logs().should.equal(0)

        self.init_session()

        update_params = self.update_params.copy()
        update_params['query'] = {
            'filters': {
                'Officer': [{
                    'category': 'officer',
                    'value': 123,
                    'filter': 'officer=123',
                    'pinned': False
                }]
            }
        }
        response, data = self.call_put_session_api(update_params)

        self.num_of_filter_logs().should.equal(1)

    def test_create_shared_session(self):
        self.init_session()

        response = self.client.post(
            '/api/allegations/session/', {'hash_id': self.db_session.hash_id})
        data = self.json(response)

        data['data']['new'].should.be.true
        data['data']['hash'].should_not.be.equal(self.db_session.hash_id)
        data['data']['query'].should.be.equal(self.db_session.query)
        data['data']['title'].should.be.equal(self.db_session.title)
        data['data']['active_tab'].should.be.equal(self.db_session.active_tab)
        data['data']['sunburst_arc'].should.be.equal(self.db_session.sunburst_arc)

    def num_of_filter_logs(self):
        return FilterLog.objects.count()
