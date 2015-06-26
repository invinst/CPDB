import json

from allegation.factories import AreaFactory
from allegation.tests.views.base import AllegationApiTestBase
from common.models import Area, Allegation


class AllegationGisApiViewTestCase(AllegationApiTestBase):

    def fetch_gis_allegations(self, **params):
        response = self.client.get('/api/allegations/gis/', params)
        data = json.loads(response.content.decode())
        return data

    def test_area_data_filter(self):
        area = AreaFactory()
        response = self.client.get('/api/areas/',{'type':area.type})
        data = json.loads(response.content.decode())
        data.should.contain('features')

        features = data['features']
        for ret_area in features:
            ret_area['properties']['type'].should.equal(area.type)

    def test_return_markers(self):
        area = Area.objects.filter()[0]
        officer = area.allegation_set.all()[0].officer
        num_markers = area.allegation_set.filter(officer=officer).count()
        allegations = self.fetch_gis_allegations(officer=officer.id)
        num_returned = len(allegations['features'])
        num_markers.should.equal(num_returned)
