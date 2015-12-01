from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory, AllegationFactory, PoliceWitnessFactory
from common.tests.core import SimpleTestCase


class MobileOfficerViewTest(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory()
        self.allegation = AllegationFactory(officer=self.officer)

    def call_related_officer_api(self, params={}):
        response = self.client.get(reverse('mobile:related_officer'), params)
        data = self.json(response)

        return response, data

    def test_successful_return_co_accused_and_witness_officer(self):
        officer = OfficerFactory()
        co_accused_officer = OfficerFactory()
        witness_officer = OfficerFactory()
        allegation = AllegationFactory(officer=officer)
        PoliceWitnessFactory(crid=allegation.crid, officer=witness_officer)
        AllegationFactory(crid=allegation.crid, officer=co_accused_officer)

        response, data = self.call_related_officer_api({'pk': officer.pk})

        response.status_code.should.be.equal(HTTP_200_OK)
        len(data['co_accused']).should.be.equal(1)
        len(data['witness']).should.be.equal(1)

    def test_return_404_when_get_invalid_pk(self):
        OfficerFactory()
        invalid_pk = -1

        response, data = self.call_related_officer_api({'pk': invalid_pk})

        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_return_404_when_get_bad_pk(self):
        OfficerFactory()
        bad_pk = 'xyz'

        response, data = self.call_related_officer_api({'pk': bad_pk})

        response.status_code.should.equal(HTTP_400_BAD_REQUEST)
