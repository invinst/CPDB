from django.forms.models import model_to_dict
from rest_framework import serializers

from common.models import Allegation
from document.models import RequestEmail


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
