import json

from allegation.tests.views.base import OfficerAllegationApiTestBase
from allegation.factories import OfficerAllegationFactory


class OfficerAllegationSunburstApiViewTestCase(OfficerAllegationApiTestBase):
    def test_get_sunburst(self):
        response = self.client.get('/api/officer-allegations/sunburst/')

        response.status_code.should.equal(200)

        data = json.loads(response.content.decode())
        data.should.contain("sunburst")

        isinstance(data['sunburst'], dict).should.be.true

        for value in data['sunburst']['children']:
            value.should.contain('tagValue')

    def test_count_disciplined_allegations(self):
        OfficerAllegationFactory(final_outcome=None)
        OfficerAllegationFactory(final_finding='SU', final_outcome='014')

        response = self.client.get('/api/officer-allegations/sunburst/')
        data = json.loads(response.content.decode())
        sustained_data = [
            child for child in data['sunburst']['children']
            if child['name'] == 'Sustained'][0]
        disciplined_data = [
            child for child in sustained_data['children']
            if child['name'] == 'Disciplined'][0]
        sum(
            x['size'] for x in
            disciplined_data['children']).should.equal(1)
