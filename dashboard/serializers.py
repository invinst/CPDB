from rest_framework import serializers

from document.models.document import Document


class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    allegation = serializers.SlugRelatedField(read_only=True, slug_field='crid')

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
            'allegation'
        )


class DocumentSingleSerializer(serializers.HyperlinkedModelSerializer):
    queries = serializers.ListField()
    allegation = serializers.SlugRelatedField(read_only=True, slug_field='crid')

    class Meta:
        model = Document
        fields = (
            'id',
            'allegation',
            'documentcloud_id',
            'number_of_request',
            'requested',
            'pending',
            'last_requested',
            'type',
            'queries'
        )
