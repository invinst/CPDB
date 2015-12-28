from rest_framework import serializers

from common.models import Allegation
from mobile.serializers.allegation_category_serializer import AllegationCategorySerializer


class AllegationSerializer(serializers.ModelSerializer):
    cat = AllegationCategorySerializer(read_only=True)

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


class AllegationDataSerializer(serializers.Serializer):
    data = AllegationSerializer()
    allegation_counts = serializers.ListField(child=serializers.IntegerField())
