from django.shortcuts import get_object_or_404
from rest_framework import serializers

from document.models import RequestEmail, Document


class MobileDocumentRequestViewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    document_id = serializers.IntegerField()

    def validate_document_id(self, value):
        return get_object_or_404(Document, pk=value).pk

    def save(self):
        email = self.validated_data['email']
        id = self.validated_data['document_id']
        document = Document.objects.get(pk=id)
        RequestEmail.objects.get_or_create(document=document, email=email)
