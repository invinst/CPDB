from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase


class MobileOfficerAllegationTest(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory()
        self.allegation = AllegationFactory(officer=self.officer)

    def call_related_officer_api(self, params={}):
        response = self.client.get(reverse('mobile:officer-allegation'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        response, data = self.call_related_officer_api({'pk': self.officer.pk})
        response.status_code.should.equal(HTTP_200_OK)
        len(data).should.be(1)
        data[0]['crid'].should.be.equal(str(self.allegation.crid))

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_related_officer_api({'pk': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_return_400_when_get_bad_pk(self):
        bad_pk = 'xyz'
        response, data = self.call_related_officer_api({'pk': bad_pk})
        response.status_code.should.equal(HTTP_400_BAD_REQUEST)
