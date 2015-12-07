from rest_framework import serializers

from common.models import Allegation
from mobile.serializers.officer_allegation_serializer import AllegationSerializer


class SuggestibleAllegationSerializer(serializers.ModelSerializer):
    data = AllegationSerializer(read_only=True)

    class Meta:
        model = Allegation
        fields = (
            'id',
            'crid',
            'cat',
            'incident_date',
            'final_finding',
            'final_outcome_class'
        )
