import datetime
import json
from django.test.testcases import TestCase
from django.test.utils import override_settings
from allegation.factories import AllegationFactory
from common.models import Officer, Allegation


class AllegationApiViewTestCase(TestCase):

    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    allegations = []

    def setUp(self):
        self.allegations = []
        for i in range(100):
            self.allegations.append(AllegationFactory())

    def fetch_allegations(self, **params):
        response = self.client.get('/api/allegations/', params)
        data = json.loads(response.content.decode())
        allegations = data['allegations']
        return allegations

    def test_fetch_allegation(self):
        data = self.fetch_allegations()
        isinstance(data, list).should.be.true
        len(data).should.equal(10)

    def test_fetch_allegation_paging(self):
        response = self.client.get('/api/allegations/')
        data = json.loads(response.content.decode())
        allegations = data['allegations']
        ids = [d[0] for d in allegations]
        response = self.client.get('/api/allegations/', {
            'start': 2
        })
        data = json.loads(response.content.decode())
        allegations = data['allegations']
        ids2 = [d[0] for d in allegations]
        ids2[0].should.equal(ids[2])

    def test_filter_by_crid(self):
        crid = self.allegations[0].crid
        data = self.fetch_allegations(crid=crid)
        for row in data:
            int(row[1]).should.equal(crid)

    def test_filter_by_category(self):
        cat = self.allegations[0].cat
        data = self.fetch_allegations(cat=cat.cat_id)
        for row in data:
            row[4].should.equal(cat.allegation_name)

    def test_filter_by_officer_name(self):
        name = self.allegations[0].officer.officer_first + " " + self.allegations[0].officer.officer_last
        data = self.fetch_allegations(officer_name=name)

        def name_contains(fullname, search):
            for part in search.split(" "):
                if part in fullname:
                    return True
            return False
        for row in data:
            name_contains(row[3], name).should.be.true

    def test_filter_by_final_outcome(self):
        data = self.fetch_allegations(final_outcome=600)
        for row in data:
            Allegation.objects.filter(pk=row[0], final_outcome=600).exists().should.be.true

    def test_filter_by_date_range(self):
        start_date = datetime.datetime.now().date()
        end_date = start_date + datetime.timedelta(days=3)
        data = self.fetch_allegations(start_date=start_date, end_date=end_date)

        def happen_between(allegation):
            incident_date = datetime.datetime.strptime(allegation[3], "%Y-%m-%d").date()
            return end_date >= incident_date >= start_date

        for row in data:
            happen_between(row).should.be.true
