from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory, AllegationFactory, ComplainingWitnessFactory
from common.tests.core import SimpleTestCase


class MobileAllegationTest(SimpleTestCase):
    def call_allegation_api(self, params={}):
        response = self.client.get(reverse('mobile:mobile-allegation'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        officer = OfficerFactory()
        allegation = AllegationFactory(officer=officer)
        complaining_witness = ComplainingWitnessFactory(crid=allegation.crid)

        response, data = self.call_allegation_api({'crid': allegation.crid})
        response.status_code.should.equal(HTTP_200_OK)

        data['allegation']['crid'].should.be.equal(str(allegation.crid))
        data['allegation']['point']['x'].should.be.equal(allegation.point.x)
        data['allegation']['point']['y'].should.be.equal(allegation.point.y)

        len(data['officers']).should.be.equal(1)
        data['officers'][0]['id'].should.be.equal(officer.pk)

        len(data['complaining_witnesses']).should.be.equal(1)
        data['complaining_witnesses'][0]['race'].should.be.equal(complaining_witness.race)
        data['complaining_witnesses'][0]['gender'].should.be.equal(complaining_witness.gender)
        data['complaining_witnesses'][0]['age'].should.be.equal(complaining_witness.age)

    def test_officer_should_be_ordered_by_number_of_involved_allegations(self):
        officer_1_complaint = OfficerFactory()
        officer_2_complaints = OfficerFactory()
        officer_3_complaints = OfficerFactory()
        allegation = AllegationFactory(officer=officer_1_complaint)
        AllegationFactory.create_batch(2, crid=allegation.crid, officer=officer_2_complaints)
        AllegationFactory.create_batch(3, crid=allegation.crid, officer=officer_3_complaints)

        response, data = self.call_allegation_api({'crid': allegation.crid})

        officers_list = [officer['id'] for officer in data['officers']]
        ordered_officers_list = [officer_3_complaints.id, officer_2_complaints.id, officer_1_complaint.id]
        officers_list.should.be.equal(ordered_officers_list)

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_allegation_api({'crid': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_no_parameters(self):
        response, data = self.call_allegation_api()
        response.status_code.should.equal(HTTP_404_NOT_FOUND)
