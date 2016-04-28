from django.core.urlresolvers import reverse
from rest_framework import status

from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory
from document.models import RequestEmail


class MobileDocumentRequestViewTest(SimpleTestCase):
    def test_successfully_create_request_email(self):
        document = DocumentFactory()
        email = 'test@gmail.com'
        params = {
            'email': email,
            'document_id': document.id
        }
        len(RequestEmail.objects.filter(email=email, document__id=document.id)).should.equal(0)

        response = self.client.post(reverse('mobile:mobile-request-email'), params)

        response.status_code.should.equal(status.HTTP_201_CREATED)
        len(RequestEmail.objects.filter(email=email, document__id=document.id)).should.equal(1)

    def test_return_400_when_document_id_is_not_existed(self):
        email = 'test@gmail.com'
        params = {
            'email': email,
            'document_id': 123
        }
        response = self.client.post(reverse('mobile:mobile-request-email'), params)
        response.status_code.should.equal(status.HTTP_400_BAD_REQUEST)

    def test_return_400_when_submit_invalid_data(self):
        document = DocumentFactory()
        email = 'test'
        params = {
            'email': email,
            'document_id': document.id
        }
        response = self.client.post(reverse('mobile:mobile-request-email'), params)
        response.status_code.should.equal(status.HTTP_400_BAD_REQUEST)
