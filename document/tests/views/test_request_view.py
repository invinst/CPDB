import faker

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class RequestViewTestCase(SimpleTestCase):

    URL = "/document/request/"

    def test_request_document(self):
        allegation = AllegationFactory()
        response = self.client.post(self.URL, {
            'crid': allegation.crid,
            'email': faker.Faker().email(),
        })

        response.status_code.should.equal(200)
        data = self.json(response)

        data.should.contain('success')
        data['success'].should.be.ok

    def test_non_exists_crid(self):
        response = self.client.post(self.URL, {
            'crid': "Not exists",
            'email': faker.Faker().email(),
        })

        response.status_code.shouldnt.equal(200)

    def test_invalid_data(self):
        response = self.client.post(self.URL)

        response.status_code.should.equal(400)
