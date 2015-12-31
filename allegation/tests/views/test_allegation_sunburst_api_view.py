import json

from allegation.factories import AllegationFactory
from allegation.tests.views.base import AllegationApiTestBase


class AllegationSunburstApiViewTestCase(AllegationApiTestBase):
    def test_get_sunburst(self):
        response = self.client.get('/api/allegations/sunburst/')

        response.status_code.should.equal(200)

        data = json.loads(response.content.decode())
        data.should.contain("sunburst")

        isinstance(data['sunburst'], dict).should.be.true

        for value in data['sunburst']['children']:
            value.should.contain('tagValue')

    def test_count_disciplined_allegations(self):
        AllegationFactory(final_outcome=None)
        AllegationFactory(final_finding='SU', final_outcome='014')

        response = self.client.get('/api/allegations/sunburst/')
        data = json.loads(response.content.decode())
        sustained_data = [
            child for child in data['sunburst']['children']
            if child['name'] == 'Sustained'][0]
        disciplined_data = [
            child for child in sustained_data['children']
            if child['name'] == 'Disciplined'][0]
        sum(
            child['size'] for child in
            disciplined_data['children']).should.equal(1)
