from rest_framework import serializers

from document.models.document import Document


class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Document
        fields = (
            'id',
            'documentcloud_id',
            'number_of_request',
            'requested',
            'pending',
            'last_requested',
            'type',
        )
