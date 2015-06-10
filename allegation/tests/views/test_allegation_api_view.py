import datetime
import json

from django.utils import timezone

from allegation.factories import AreaFactory
from allegation.tests.views.base import AllegationApiTestBase
from common.models import Complaint


class AllegationApiViewTestCase(AllegationApiTestBase):

    def fetch_allegations(self, **params):
        response = self.client.get('/api/allegations/', params)
        data = json.loads(response.content.decode())
        allegations = data['allegations']
        return allegations

    def test_area_data_filter(self):
        area = AreaFactory()
        response = self.client.get('/api/areas/', {'type': area.type})
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

    def test_filter_by_main_category(self):
        cat = self.allegations[0].cat
        data = self.fetch_allegations(category=cat.category)
        for row in data:
            row['category']['category'].should.equal(cat.category)

    def test_filter_by_officer_id(self):
        pk = self.allegations[0].officers.all()[0].id
        data = self.fetch_allegations(officers__id=pk)

        for row in data:
            officer_ids = [o['id'] for o in row['officers']]
            officer_ids.should.contain(pk)

    def test_filter_by_final_outcome(self):
        data = self.fetch_allegations(final_outcome=600)
        for row in data:
            Complaint.objects.filter(pk=row['allegation']['id'], final_outcome=600).exists().should.be.true

    def test_filter_by_date_range(self):
        start_date = timezone.now().date()
        end_date = start_date + datetime.timedelta(days=3)
        response_format = "%Y-%m-%d %H:%M:%S"

        def happen_between(row):
            incident_date = datetime.datetime.strptime(row['allegation']['incident_date'], response_format).date()
            return end_date >= incident_date >= start_date

        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        allegations = self.fetch_allegations(incident_date_only__range="%s,%s" % (start_date_str, end_date_str))
        for allegation in allegations:
            happen_between(allegation).should.be.true

        allegations = self.fetch_allegations(incident_date_only__year=start_date.year)
        for allegation in allegations:
            year = datetime.datetime.strptime(allegation['allegation']['incident_date'], response_format).year
            year.should.equal(start_date.year)

        allegations = self.fetch_allegations(incident_date_only__year_month=start_date.strftime("%Y-%m"))
        for allegation in allegations:
            date = datetime.datetime.strptime(allegation['allegation']['incident_date'], response_format)
            date.year.should.equal(start_date.year)
            date.month.should.equal(start_date.month)

        allegations = self.fetch_allegations(incident_date_only=start_date.strftime("%Y-%m-%d"))
        for allegation in allegations:
            date = datetime.datetime.strptime(allegation['allegation']['incident_date'], response_format).date()
            date.should.equal(start_date)
