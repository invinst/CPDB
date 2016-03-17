from datetime import datetime

from django.core.urlresolvers import reverse

from allegation.factories import (
    OfficerAllegationFactory, OfficerFactory, ComplainingWitnessFactory, AllegationFactory)
from common.tests.core import SimpleTestCase


RACE_GENDER_API_ENDPOINT = reverse('allegation:officer-allegation-race-gender-api')


class RaceGenderAPI(SimpleTestCase):
    def get_race_gender_info(self, **kwargs):
        response = self.client.get(RACE_GENDER_API_ENDPOINT, kwargs)
        data = self.json(response)

        return response, data

    def test_race_gender_api(self):
        officer_1 = OfficerFactory(race='black', gender='M')
        officer_2 = OfficerFactory(race='white', gender='F')
        officer_allegation_1 = OfficerAllegationFactory(officer=officer_1)
        officer_allegation_2 = OfficerAllegationFactory(officer=officer_2)
        ComplainingWitnessFactory(
            crid=officer_allegation_1.allegation.crid, gender='M',
            race='black', allegation=officer_allegation_1.allegation)
        ComplainingWitnessFactory(
            race='white', crid=officer_allegation_2.allegation.crid,
            gender='F', allegation=officer_allegation_2.allegation)

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
        officer_allegation_1 = OfficerAllegationFactory(officer=officer_1)
        officer_allegation_2 = OfficerAllegationFactory(officer=officer_2)
        ComplainingWitnessFactory(
            race='black', crid=officer_allegation_1.allegation.crid,
            gender='M', allegation=officer_allegation_1.allegation)
        ComplainingWitnessFactory(
            race='white', crid=officer_allegation_2.allegation.crid,
            gender='F', allegation=officer_allegation_2.allegation)

        response, data = self.get_race_gender_info(
            allegation__crid=officer_allegation_2.allegation.crid)

        response.status_code.should.equal(200)
        for x in ['officers', 'complaining_witness']:
            data[x]['gender'].should.contain('F')
            data[x]['gender'].shouldnt.contain('M')
            data[x]['race'].shouldnt.contain('black')
            data[x]['race'].should.contain('white')

    def test_filter_by_one_graph_does_not_change_others(self):
        officer_1 = OfficerFactory(race='black', gender='M')
        officer_2 = OfficerFactory(race='white', gender='F')
        officer_allegation_1 = OfficerAllegationFactory(officer=officer_1)
        officer_allegation_2 = OfficerAllegationFactory(officer=officer_2)
        ComplainingWitnessFactory(
            race='black', crid=officer_allegation_1.allegation.crid,
            gender='M', allegation=officer_allegation_1.allegation)
        ComplainingWitnessFactory(
            race='white', crid=officer_allegation_2.allegation.crid,
            gender='F', allegation=officer_allegation_2.allegation)

        response, data = self.get_race_gender_info(officer__gender='F')

        data['officers']['gender']['M'].should.equal(1)
        data['officers']['gender']['F'].should.equal(1)

        data['officers']['race'].shouldnt.contain('black')
        data['officers']['race']['white'].should.equal(1)

        data['complaining_witness']['gender'].shouldnt.contain('M')
        data['complaining_witness']['gender']['F'].should.equal(1)

        data['complaining_witness']['race'].shouldnt.contain('black')
        data['complaining_witness']['race']['white'].should.equal(1)

    def test_age_range(self):
        age_values = [20, 31, 41, 51, 61]
        expect_officer_age = {
            '20-30': 1,
            '31-40': 1,
            '41-50': 1,
            '51-60': 1,
            '61+': 1,
        }

        for val in age_values:
            allegation = AllegationFactory(incident_date=datetime(2000, 1, 1))
            OfficerAllegationFactory(
                officer=OfficerFactory(birth_year=2000 - val),
                allegation=allegation)
            ComplainingWitnessFactory(age=val, allegation=allegation)

        allegation = AllegationFactory()
        OfficerAllegationFactory(
            officer=OfficerFactory(birth_year=None), allegation=allegation)
        ComplainingWitnessFactory(age=None, allegation=allegation)

        response, data = self.get_race_gender_info()

        response.status_code.should.equal(200)
        data['officers']['age'].should.equal(expect_officer_age)
        data['complaining_witness']['age'].should.equal(expect_officer_age)
