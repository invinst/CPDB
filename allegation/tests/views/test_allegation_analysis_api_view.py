import json

from common.tests.core import SimpleTestCase


class AllegationAnalysisApiViewTestCase(SimpleTestCase):
    def call_api(self, params={}):
        response = self.client.get('/api/allegations/analysis', params)
        data = json.loads(response.content.decode())
        return response, data

    def test_get_analysis_api(self):
        response, data = self.call_api()
        response.status_code.should.equal(200)
        analytics = data['analytics']
        len(analytics.keys()).should.equal(7)
