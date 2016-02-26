from rest_framework import serializers

from common.models import Allegation
from document.serializers import DocumentSerializer


class AllegationRequestSerializer(serializers.HyperlinkedModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Allegation
        fields = (
            'id',
            'crid',
            'url',
            'last_document_requested',
            'total_document_requests',
            'documents'
        )
