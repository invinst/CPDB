from rest_framework import serializers

from document.models import RequestEmail, Document


class MobileDocumentRequestViewSerializer(serializers.Serializer):
    email = serializers.EmailField()
    document_id = serializers.IntegerField()

    def validate_document_id(self, value):
        if not Document.objects.filter(pk=value):
            raise serializers.ValidationError('Document is not existed')
        return value

    def save(self):
        email = self.validated_data['email']
        id = self.validated_data['document_id']
        document = Document.objects.get(pk=id)
        RequestEmail.objects.get_or_create(document=document, email=email)
