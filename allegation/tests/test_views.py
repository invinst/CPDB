import json
from django.test.testcases import TestCase
from django.test.utils import override_settings
from allegation.factories import AllegationFactory


class AllegationApiViewTestCase(TestCase):

    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    def setUp(self):
        for i in range(100):
            AllegationFactory()

    def test_fetch_allegation(self):
        response = self.client.get('/api/allegations/')
        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())
        isinstance(data, list).should.be.true
        len(data).should.equal(10)

    def test_fetch_allegation_paging(self):
        response = self.client.get('/api/allegations/')
        data = json.loads(response.content.decode())
        ids = [d['id'] for d in data]
        response = self.client.get('/api/allegations/', {
            'page': 2
        })
        data = json.loads(response.content.decode())
        len(data).should.equal(10)
        ids2 = [d['id'] for d in data]
        for _id in ids2:
            ids.shouldnt.contain(_id)

