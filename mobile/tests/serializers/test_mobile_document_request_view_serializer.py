from rest_framework import serializers

from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory
from document.models import RequestEmail
from mobile.serializers.mobile_document_request_view_serializer import MobileDocumentRequestViewSerializer


class MobileDocumentRequestViewSerializerTest(SimpleTestCase):
    def test_invalid_document(self):
        data = {
            'document_id': 123,
            'email': 'test@gmail.com'
        }

        requestSerializer = MobileDocumentRequestViewSerializer(data=data)

        requestSerializer.is_valid.when.called_with(raise_exception=True).should.throw(
            serializers.ValidationError,
            'Document is not existed'
        )
        requestSerializer.is_valid(raise_exception=False).should.be.false

    def test_invalid_email(self):
        document = DocumentFactory()
        data = {
            'document_id': document.id,
            'email': 'invalid'
        }

        requestSerializer = MobileDocumentRequestViewSerializer(data=data)

        requestSerializer.is_valid.when.called_with(raise_exception=True).should.throw(
            serializers.ValidationError,
            'Enter a valid email address.'
        )
        requestSerializer.is_valid(raise_exception=False).should.be.false

    def test_save_valid_data(self):
        document = DocumentFactory()
        data = {
            'document_id': document.id,
            'email': 'test@gmail.com'
        }

        requestSerializer = MobileDocumentRequestViewSerializer(data=data)

        requestSerializer.is_valid(raise_exception=True).should.be.true
        requestSerializer.save()
        RequestEmail.objects.filter(document=document).values_list('email', flat=True).should.contain('test@gmail.com')
