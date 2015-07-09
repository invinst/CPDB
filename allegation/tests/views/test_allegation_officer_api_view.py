import json
from allegation.tests.views.base import AllegationApiTestBase


class AllegationOfficerApiTestCase(AllegationApiTestBase):
    def test_response_format(self):
        response = self.client.get("/api/allegations/officers/")

        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())

        data.should.contain('officers')
        data.should.contain('overview')

        isinstance(data['officers'], list).should.be.true
        isinstance(data['overview'], list).should.be.true
