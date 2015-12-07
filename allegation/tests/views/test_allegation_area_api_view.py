from django.core.urlresolvers import reverse

from allegation.factories import AreaFactory
from common.tests.core import SimpleTestCase


class AllegationAreaAPIViewTestCase(SimpleTestCase):
    def test_get_area_skip_null_polygon(self):
        area = AreaFactory(polygon=None)
        AreaFactory()

        response = self.client.get('/api/areas/', {})
        data = self.json(response)

        data.should.contain('features')
        data['features'].should.have.length_of(1)
        data['features'][0]['properties']['id'].shouldnt.equal(area.id)
