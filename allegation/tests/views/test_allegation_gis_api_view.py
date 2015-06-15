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
        num_markers = area.allegation_set.all().count()
        allegations = self.fetch_gis_allegations(areas__id=area.id)
        num_returned = len(allegations['features'])
        num_markers.should.equal(num_returned)

    def test_multiple_areas(self):
        areas = Area.objects.filter()
        num_markers = Allegation.objects.filter(areas=areas).count()
        allegations = self.fetch_gis_allegations(areas__id=list(areas.values_list('pk', flat=True)))
        num_returned = len(allegations['features'])
        num_markers.should.equal(num_returned)
