import json

from allegation.tests.views.base import OfficerAllegationApiTestBase


class OfficerAllegationSunburstApiViewTestCase(OfficerAllegationApiTestBase):
    def test_get_sunburst(self):
        response = self.client.get('/api/officer-allegations/sunburst/')

        response.status_code.should.equal(200)

        data = json.loads(response.content.decode())
        data.should.contain("sunburst")

        isinstance(data['sunburst'], dict).should.be.true

        for value in data['sunburst']['children']:
            value.should.contain('tagValue')
