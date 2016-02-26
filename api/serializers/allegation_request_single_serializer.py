from rest_framework import serializers

from common.models import Allegation
from document.serializers import DocumentSerializer


class AllegationRequestSingleSerializer(serializers.HyperlinkedModelSerializer):
    queries = serializers.ListField()
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Allegation
        fields = (
            'id',
            'crid',
            'url',
            'last_document_requested',
            'total_document_requests',
            'queries',
            'documents'
        )
