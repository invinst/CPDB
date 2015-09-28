from rest_framework import serializers

from common.models import Allegation


class AllegationRequestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Allegation
        fields = ('id',
                  'crid',
                  'url',
                  'number_of_request',
                  'document_requested',
                  'document_id',
                  )
