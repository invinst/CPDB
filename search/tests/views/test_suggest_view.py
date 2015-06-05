import json

from allegation.factories import OfficerFactory, AllegationCategoryFactory, AllegationFactory
from common.models import AllegationCategory
from common.tests.core import SimpleTestCase


class SuggestViewTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()

    def test_detect_suggest_type_officer_name(self):
        OfficerFactory(officer_first='Jerry', officer_last="Dao")
        response = self.client.get("/search/suggest/", {
            'term': 'je'
        })
        data = json.loads(response.content.decode())
        data.should.contain('officer_id')

        response = self.client.get("/search/suggest/", {
            'term': 'genie'
        })
        data = json.loads(response.content.decode())
        data.shouldnt.contain('officer_id')

    def test_detect_suggest_type_officer_badge_number(self):
        OfficerFactory(star=123456)
        response = self.client.get("/search/suggest/", {
            'term': '12'
        })
        data = json.loads(response.content.decode())
        data.should.contain('officer__star')

    def test_detect_suggest_type_complaint_category(self):
        AllegationCategoryFactory(allegation_name='Bonding category')
        response = self.client.get("/search/suggest/", {
            'term': 'Bonding'
        })
        data = json.loads(response.content.decode())
        data.should.contain('cat')

    def test_detect_suggest_type_complaint_id_number(self):
        AllegationFactory(crid=123456)
        response = self.client.get("/search/suggest/", {
            'term': '1234'
        })
        data = json.loads(response.content.decode())
        data.should.contain('crid')

        response = self.client.get("/search/suggest/", {
            'term': '123'
        })
        data = json.loads(response.content.decode())
        data.shouldnt.contain('crid')

        response = self.client.get("/search/suggest/", {
            'term': '8908'
        })
        data = json.loads(response.content.decode())
        data.shouldnt.contain('crid')


