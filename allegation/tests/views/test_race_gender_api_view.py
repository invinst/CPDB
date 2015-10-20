from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory, OfficerFactory, ComplainingWitnessFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation

RACE_GENDER_API_ENDPOINT = reverse('allegation:allegation-race-gender-api')

class RaceGenderAPI(SimpleTestCase):
    def setUp(self):
        Allegation.objects.all().delete()

    def get_race_gender_info(self, **kwargs):
        response = self.client.get(RACE_GENDER_API_ENDPOINT, kwargs)
        data = self.json(response)

        return response, data

    def test_race_gender_api(self):
        officer_1 = OfficerFactory(race='black', gender='M')
        officer_2 = OfficerFactory(race='white', gender='F')
        allegation_1 = AllegationFactory(officer=officer_1)
        allegation_2 = AllegationFactory(officer=officer_2)
        ComplainingWitnessFactory(race='black', gender='M', crid=allegation_1.crid)
        ComplainingWitnessFactory(race='white', gender='F', crid=allegation_2.crid)

        response, data = self.get_race_gender_info()

        response.status_code.should.equal(200)

        for x in ['officers', 'complaining_witness']:
            data[x]['gender']['M'].should.equal(1)
            data[x]['gender']['F'].should.equal(1)
            data[x]['race']['black'].should.equal(1)
            data[x]['race']['white'].should.equal(1)

    def test_race_gender_api_that_complaint_doesnt_contain_in_allegations(self):
        OfficerFactory(race='black', gender='M')
        OfficerFactory(race='white', gender='F')
        ComplainingWitnessFactory(race='black', gender='M')
        ComplainingWitnessFactory(race='white', gender='F')

        response, data = self.get_race_gender_info()

        response.status_code.should.equal(200)
        for x in ['officers', 'complaining_witness']:
            data[x]['gender'].shouldnt.contain('M')
            data[x]['gender'].shouldnt.contain('F')
            data[x]['race'].shouldnt.contain('black')
            data[x]['race'].shouldnt.contain('white')

    def test_race_gender_api_with_filter(self):
        officer_1 = OfficerFactory(race='black', gender='M')
        officer_2 = OfficerFactory(race='white', gender='F')
        allegation_1 = AllegationFactory(officer=officer_1)
        allegation_2 = AllegationFactory(officer=officer_2)
        ComplainingWitnessFactory(race='black', gender='M', crid=allegation_1.crid)
        ComplainingWitnessFactory(race='white', gender='F', crid=allegation_2.crid)

        response, data = self.get_race_gender_info(crid=allegation_2.crid)

        response.status_code.should.equal(200)
        for x in ['officers', 'complaining_witness']:
            data[x]['gender'].should.contain('F')
            data[x]['gender'].shouldnt.contain('M')
            data[x]['race'].shouldnt.contain('black')
            data[x]['race'].should.contain('white')

