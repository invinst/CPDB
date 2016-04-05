from rest_framework.reverse import reverse
from rest_framework.status import (
    HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND)
from allegation.factories import (
    OfficerFactory, PoliceWitnessFactory, OfficerAllegationFactory)
from common.tests.core import SimpleTestCase


class MobileOfficerViewTest(SimpleTestCase):
    def call_related_officer_api(self, params={}):
        response = self.client.get(reverse('mobile:mobile-officer'), params)
        data = self.json(response)

        return response, data

    def test_officer_detail_when_successfully_call_the_api(self):
        officer = OfficerFactory()
        co_accused_officer = OfficerFactory()
        witness_officer = OfficerFactory()
        officer_allegation = OfficerAllegationFactory(officer=officer)
        PoliceWitnessFactory(crid=officer_allegation.allegation.crid, officer=witness_officer,
                             allegation=officer_allegation.allegation)
        OfficerAllegationFactory(allegation=officer_allegation.allegation, officer=co_accused_officer)

        response, data = self.call_related_officer_api({'pk': officer.pk})
        response.status_code.should.equal(HTTP_200_OK)

        detail = data['detail']
        complaints = data['complaints']

        detail['id'].should.be.equal(officer.id)
        detail['appt_date'].should.be.equal(officer.appt_date)
        detail['unit'].should.be.equal(officer.unit)
        detail['gender'].should.be.equal(officer.gender)
        detail['rank'].should.be.equal(officer.rank)
        detail['race'].should.be.equal(officer.race)
        detail['officer_first'].should.be.equal(officer.officer_first)
        detail['officer_last'].should.be.equal(officer.officer_last)

        len(complaints).should.be(1)
        complaints[0]['crid'].should.be.equal(str(officer_allegation.allegation.crid))
        len(complaints[0]['officer_allegation_set']).should.be.equal(2)
        len(data['co_accused']).should.be.equal(1)
        data.should.contain('distribution')

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_related_officer_api({'pk': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_return_400_when_get_bad_pk(self):
        bad_pk = 'xyz'
        response, data = self.call_related_officer_api({'pk': bad_pk})
        response.status_code.should.equal(HTTP_400_BAD_REQUEST)
