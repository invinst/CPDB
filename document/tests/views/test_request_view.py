import faker

from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory
from share.factories import SessionFactory


class RequestViewTestCase(SimpleTestCase):

    URL = "/document/request/"

    def test_request_document(self):
        document = DocumentFactory()
        session = SessionFactory()
        response = self.client.post(self.URL, {
            'document_id': document.id,
            'email': faker.Faker().email(),
            'session': session.hash_id,
        })
        response.status_code.should.equal(200)
        data = self.json(response)

        data.should.contain('success')
        data['success'].should.be.ok

    def test_non_exists_crid(self):
        response = self.client.post(self.URL, {
            'document_id': -1,
            'email': faker.Faker().email(),
        })

        response.status_code.shouldnt.equal(200)

    def test_invalid_data(self):
        response = self.client.post(self.URL)

        response.status_code.should.equal(400)
