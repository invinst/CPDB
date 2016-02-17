import json

from allegation.factories import (
    AreaFactory, AllegationFactory, OfficerAllegationFactory)
from allegation.tests.views.base import OfficerAllegationApiTestBase
from common.models import Area, Allegation, OfficerAllegation


class OfficerAllegationGisApiViewTestCase(OfficerAllegationApiTestBase):
    def setUp(self):
        self.officer_allegations = OfficerAllegationFactory.create_batch(3)

    def fetch_gis_allegations(
            self, url='/api/officer-allegations/cluster/', **params):
        response = self.client.get(url, params)
        data = json.loads(response.content.decode())
        return data

    def test_area_data_filter(self):
        area = AreaFactory()
        response = self.client.get('/api/areas/', {'type': area.type})
        data = json.loads(response.content.decode())
        data.should.contain('features')

        features = data['features']
        for ret_area in features:
            ret_area['properties']['type'].should.equal(area.type)

    def test_return_markers(self):
        area = Area.objects.filter()[0]
        officer_allegations = OfficerAllegation.objects.filter(
            allegation__areas__pk=area.pk)
        officer = officer_allegations[0].officer
        num_markers = Allegation.objects\
            .filter(officerallegation__officer__pk=officer.pk)\
            .exclude(point__isnull=True).count()
        officer_allegations = self.fetch_gis_allegations(
            url='/api/officer-allegations/gis/', officer=officer.pk)
        num_returned = len(officer_allegations['features'])
        num_markers.should.equal(num_returned)

    def test_return_cluster_success(self):
        num_markers = Allegation.objects.all()\
            .exclude(point__isnull=True).count()
        officer_allegations = self.fetch_gis_allegations(
            url='/api/officer-allegations/cluster/')
        num_returned = len(officer_allegations['features'])
        num_markers.should.be.above(num_returned)
        num_returned.shouldnt.equal(0)

    def test_return_cluster_success_no_points(self):
        officer_allegation = self.officer_allegations[0]
        officer_allegation.allegation.point = None
        officer_allegation.allegation.save()
        officer_allegations = self.fetch_gis_allegations(
            url='/api/officer-allegations/gis/',
            officer=officer_allegation.officer_id)
        num_returned = len(officer_allegations['features'])
        num_returned.should.equal(0)

    def test_skip_duplicate_crid(self):
        allegation = AllegationFactory(
            crid=self.officer_allegations[0].allegation.crid)
        OfficerAllegationFactory(allegation=allegation)
        data = self.fetch_gis_allegations(url='/api/officer-allegations/gis/')
        data['features'].should.be.a(list)
        data['features'].should.have.length_of(3)  # duplicate crid is ignored
