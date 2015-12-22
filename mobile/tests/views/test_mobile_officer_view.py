from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory, AllegationFactory, PoliceWitnessFactory
from common.tests.core import SimpleTestCase


class MobileOfficerViewTest(SimpleTestCase):
    def call_related_officer_api(self, params={}):
        response = self.client.get(reverse('mobile:officer'), params)
        data = self.json(response)

        return response, data

    def test_officer_detail_when_successfully_call_the_api(self):
        officer = OfficerFactory()
        co_accused_officer = OfficerFactory()
        witness_officer = OfficerFactory()
        allegation = AllegationFactory(officer=officer)
        PoliceWitnessFactory(crid=allegation.crid, officer=witness_officer)
        AllegationFactory(crid=allegation.crid, officer=co_accused_officer)

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
        complaints[0]['crid'].should.be.equal(str(allegation.crid))
        len(data['co_accused']).should.be.equal(1)
        len(data['witness']).should.be.equal(1)

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_related_officer_api({'pk': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_return_400_when_get_bad_pk(self):
        bad_pk = 'xyz'
        response, data = self.call_related_officer_api({'pk': bad_pk})
        response.status_code.should.equal(HTTP_400_BAD_REQUEST)


