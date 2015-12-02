from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase


class MobileAllegationTest(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory()

        self.allegation = AllegationFactory(officer=self.officer)

    def call_allegation_api(self, params={}):
        response = self.client.get(reverse('mobile:allegation'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        response, data = self.call_allegation_api({'crid': self.allegation.crid})
        response.status_code.should.equal(HTTP_200_OK)
        data['allegation']['crid'].should.be.equal(str(self.allegation.crid))

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_allegation_api({'crid': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)
