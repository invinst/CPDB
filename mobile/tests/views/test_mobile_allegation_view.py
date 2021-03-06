from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory, ComplainingWitnessFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase


class MobileAllegationTest(SimpleTestCase):
    def call_allegation_api(self, params={}):
        response = self.client.get(reverse('mobile:mobile-allegation'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        officer = OfficerFactory()
        officer_allegation = OfficerAllegationFactory(officer=officer)
        allegation = officer_allegation.allegation
        complaining_witness = ComplainingWitnessFactory(allegation=allegation)

        response, data = self.call_allegation_api({'crid': allegation.crid})
        response.status_code.should.equal(HTTP_200_OK)

        data['allegation']['crid'].should.be.equal(str(allegation.crid))
        data['allegation']['point']['x'].should.be.equal(allegation.point.x)
        data['allegation']['point']['y'].should.be.equal(allegation.point.y)

        len(data['allegation']['officer_allegation_set']).should.be.equal(1)
        data['allegation']['officer_allegation_set'][0]['officer']['id'].should.be.equal(officer.pk)

        len(data['complaining_witnesses']).should.be.equal(1)
        data['complaining_witnesses'][0]['race'].should.be.equal(complaining_witness.race)
        data['complaining_witnesses'][0]['gender'].should.be.equal(complaining_witness.gender)
        data['complaining_witnesses'][0]['age'].should.be.equal(complaining_witness.age)

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_allegation_api({'crid': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_no_parameters(self):
        response, data = self.call_allegation_api()
        response.status_code.should.equal(HTTP_404_NOT_FOUND)
