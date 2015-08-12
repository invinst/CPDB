import json

from allegation.tests.views.base import AllegationApiTestBase


class AllegationSunburstApiViewTestCase(AllegationApiTestBase):
    def test_get_summary(self):
        response = self.client.get('/api/allegations/sunburst/')

        response.status_code.should.equal(200)

        data = json.loads(response.content.decode())
        data.should.contain("sunburst")

        isinstance(data['sunburst'], dict).should.be.true

        for key, value in data['sunburst'].items():
            value.should.contain('tagValue')
