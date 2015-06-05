import datetime
import json

from django.test.testcases import TestCase
from django.utils import timezone

from allegation.factories import AllegationFactory, AreaFactory
from common.models import Allegation


class AllegationApiViewTestCase(TestCase):
    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    def setUp(self):
        self.allegations = []
        for i in range(400):
            self.allegations.append(AllegationFactory())

    def fetch_allegations(self, **params):
        response = self.client.get('/api/allegations/', params)
        data = json.loads(response.content.decode())
        allegations = data['allegations']
        return allegations

    def test_area_data_filter(self):
        area = AreaFactory()
        response = self.client.get('/api/areas/',{'type':area.type})
        data = json.loads(response.content.decode())
        data.should.contain('features')

        features = data['features']
        for ret_area in features:
            ret_area['properties']['type'].should.equal(area.type)

    def test_fetch_allegation(self):
        data = self.fetch_allegations()
        isinstance(data, list).should.be.true
        len(data).should.equal(10)

    def test_fetch_allegation_paging(self):

        allegations = self.fetch_allegations()
        ids = [d['allegation']['id'] for d in allegations]
        response = self.client.get('/api/allegations/', {
            'start': 2
        })
        allegations = self.fetch_allegations(start=2)
        ids2 = [d['allegation']['id'] for d in allegations]
        ids2[0].should.equal(ids[2])

    def test_filter_by_crid(self):
        crid = self.allegations[0].crid
        data = self.fetch_allegations(crid=crid)
        for row in data:
            int(row['allegation']['crid']).should.equal(crid)

    def test_filter_by_category(self):
        cat = self.allegations[0].cat
        data = self.fetch_allegations(cat=cat.cat_id)
        for row in data:
            row['category']['allegation_name'].should.equal(cat.allegation_name)

    def test_filter_by_officer_id(self):
        pk = self.allegations[0].officer.id
        data = self.fetch_allegations(officer_id=pk)

        for row in data:
            row['officer']['id'].should.equal(pk)

    def test_filter_by_final_outcome(self):
        data = self.fetch_allegations(final_outcome=600)
        for row in data:
            Allegation.objects.filter(pk=row['allegation']['id'], final_outcome=600).exists().should.be.true

    def test_filter_by_date_range(self):
        start_date = timezone.now().date()
        end_date = start_date + datetime.timedelta(days=3)
        data = self.fetch_allegations(incident_date__range="%s,%s"  % (start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")))

        def happen_between(allegation):
            incident_date = datetime.datetime.strptime(allegation['allegation']['incident_date'], "%Y-%m-%d %H:%M:%S").date()
            return end_date >= incident_date >= start_date

        for row in data:
            happen_between(row).should.be.true
