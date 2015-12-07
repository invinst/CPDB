from rest_framework.reverse import reverse
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase


class MobileOfficerViewTest(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory()

    def call_related_officer_api(self, params={}):
        response = self.client.get(reverse('mobile:officer'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        response, data = self.call_related_officer_api({'pk': self.officer.pk})
        response.status_code.should.equal(HTTP_200_OK)

        data['id'].should.be.equal(self.officer.id)
        data['appt_date'].should.be.equal(self.officer.appt_date)
        data['unit'].should.be.equal(self.officer.unit)
        data['gender'].should.be.equal(self.officer.gender)
        data['rank'].should.be.equal(self.officer.rank)
        data['race'].should.be.equal(self.officer.race)
        data['officer_first'].should.be.equal(self.officer.officer_first)
        data['officer_last'].should.be.equal(self.officer.officer_last)

    def test_return_404_when_get_invalid_pk(self):
        invalid_pk = -1
        response, data = self.call_related_officer_api({'pk': invalid_pk})
        response.status_code.should.equal(HTTP_404_NOT_FOUND)

    def test_return_400_when_get_bad_pk(self):
        bad_pk = 'xyz'
        response, data = self.call_related_officer_api({'pk': bad_pk})
        response.status_code.should.equal(HTTP_400_BAD_REQUEST)
