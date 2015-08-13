import json

from common.tests.core import SimpleTestCase


class AllegationAnalysisApiViewTestCase(SimpleTestCase):
    def test_get_analysis_api(self, **params):
        response = self.client.get('/api/allegations/', params)
        response.status_code.should.equal(200)

        data = json.loads(response.content.decode())
        analytics = data['analytics']
        len(analytics.keys()).should.equal(7)
