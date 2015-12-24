from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class MobileAllegationOfficerTest(SimpleTestCase):
    def setUp(self):
        self.crid = AllegationFactory().crid
        AllegationFactory(crid=self.crid)

    def call_allegation_api(self, params={}):
        response = self.client.get(reverse('mobile:allegation-officer'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        response, data = self.call_allegation_api({'crid': self.crid})
        response.status_code.should.equal(HTTP_200_OK)
        len(data).should.be.equal(2)

    def test_return_404_when_get_invalid_pk(self):
        bad_crid = -1
        response, data = self.call_allegation_api({'crid': bad_crid})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)
