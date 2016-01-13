from rest_framework import serializers

from common.models import Allegation


class AllegationRequestSingleSerializer(serializers.HyperlinkedModelSerializer):
    queries = serializers.ListField()

    class Meta:
        model = Allegation
        fields = ('id',
                  'crid',
                  'url',
                  'number_of_request',
                  'document_requested',
                  'document_id',
                  'queries',
                  )
