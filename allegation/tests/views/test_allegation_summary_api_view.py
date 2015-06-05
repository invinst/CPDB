import json
from allegation.tests.views.base import AllegationApiTestBase


class AllegationSummaryApiViewTestCase(AllegationApiTestBase):
    def test_get_summary(self):
        response = self.client.get('/api/allegations/summary/')

        data = json.loads(response.content.decode())
        data.should.contain("summary")

        isinstance(data['summary'], list).should.be.true
