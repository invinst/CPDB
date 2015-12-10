import json

from django.contrib.gis.geos import Point

from allegation.factories import AreaFactory, AllegationFactory
from allegation.tests.views.base import AllegationApiTestBase
from common.models import Area, Allegation


class AllegationGisApiViewTestCase(AllegationApiTestBase):
    def setUp(self):
        self.allegations = AllegationFactory.create_batch(3)

    def fetch_gis_allegations(self, url='/api/allegations/cluster/', **params):
        response = self.client.get(url, params)
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
        num_markers = area.allegation_set.filter(officer=officer).exclude(point=None).count()
        allegations = self.fetch_gis_allegations(url='/api/allegations/gis/', officer=officer.id)
        num_returned = len(allegations['features'])
        num_markers.should.equal(num_returned)

    def test_return_cluster_success(self):
        num_markers = Allegation.objects.filter().exclude(point=None).count()
        allegations = self.fetch_gis_allegations(url='/api/allegations/cluster/')
        num_returned = len(allegations['features'])
        num_markers.should.be.above(num_returned)
        num_returned.shouldnt.equal(0)

    def test_return_cluster_success_no_points(self):
        allegation = self.allegations[0]
        allegation.point = None
        allegation.save()
        allegations = self.fetch_gis_allegations(url='/api/allegations/gis/', officer=allegation.officer_id)
        num_returned = len(allegations['features'])
        num_returned.should.equal(0)

    def test_skip_duplicate_crid(self):
        allegation = AllegationFactory(crid=self.allegations[0].crid)
        data = self.fetch_gis_allegations(url='/api/allegations/gis/')
        data['features'].should.be.a(list)
        data['features'].should.have.length_of(3)  # duplicate crid is ignored
