import datetime
import json
from django.test.testcases import TestCase
from django.test.utils import override_settings
from allegation.factories import AllegationFactory
from common.models import Officer


class AllegationApiViewTestCase(TestCase):

    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    allegations = []

    def setUp(self):
        self.allegations = []
        for i in range(100):
            self.allegations.append(AllegationFactory())

    def test_fetch_allegation(self):
        response = self.client.get('/api/allegations/')
        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())
        isinstance(data, list).should.be.true
        len(data).should.equal(10)

    def test_fetch_allegation_paging(self):
        response = self.client.get('/api/allegations/')
        data = json.loads(response.content.decode())
        ids = [d['id'] for d in data]
        response = self.client.get('/api/allegations/', {
            'page': 2
        })
        data = json.loads(response.content.decode())
        len(data).should.equal(10)
        ids2 = [d['id'] for d in data]
        for _id in ids2:
            ids.shouldnt.contain(_id)

    def test_filter_by_crid(self):
        crid = self.allegations[0].crid
        response = self.client.get('/api/allegations/', {
            'crid': crid
        })
        data = json.loads(response.content.decode())
        for row in data:
            int(row['crid']).should.equal(crid)

    def test_filter_by_category(self):
        cat = self.allegations[0].cat.cat_id
        response = self.client.get('/api/allegations/', {
            'cat': cat
        })
        data = json.loads(response.content.decode())
        for row in data:
            row['cat']['pk'].should.equal(cat)

    def test_filter_by_officer_name(self):
        name = self.allegations[0].officer.officer_first + " " + self.allegations[0].officer.officer_last
        response = self.client.get('/api/allegations/', {
            'officer_name': name
        })
        data = json.loads(response.content.decode())

        def is_officer_name(officer, name):
            name_parts = name.split(' ')
            for n in name_parts:
                if n in officer.officer_first or n in officer.officer_last:
                    return True

        for row in data:
            officer_id = row['officer']['pk']
            officer = Officer.objects.get(pk=officer_id)
            is_officer_name(officer, name).should.be.true

    def test_filter_by_final_outcome(self):
        response = self.client.get('/api/allegations/', {
            'final_outcome': 600
        })
        data = json.loads(response.content.decode())
        for row in data:
            row['final_outcome'].should.equal('600')

    def test_filter_by_date_range(self):
        start_date = datetime.datetime.now().date()
        end_date = start_date + datetime.timedelta(days=3)
        response = self.client.get('/api/allegations/', {
            'start_date': start_date,
            'end_date': end_date,
        })

        def happen_between(allegation):
            row_start_date = datetime.datetime.strptime(allegation['start_date'], "%Y-%m-%d").date()
            row_end_date = datetime.datetime.strptime(allegation['end_date'], "%Y-%m-%d").date()
            return end_date >= row_end_date >= row_start_date >= start_date

        data = json.loads(response.content.decode())
        for row in data:
            happen_between(row).should.be.true

    '''def test_filter_by_neighborhood_name(self):
        neighborhood = 'ABC'
        beat = beat_from_neighborhood_name(neighborhood)

        response = self.client.get('/api/allegations/', {
            'neighborhood': neighborhood
        })

        for row in json.loads(response.content.decode()):
            row['beat'].should.equal(beat)'''
