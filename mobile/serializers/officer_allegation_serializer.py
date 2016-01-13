from rest_framework import serializers

from common.models import OfficerAllegation
from mobile.serializers.allegation_category_serializer import \
    AllegationCategorySerializer


class OfficerAllegationSerializer(serializers.ModelSerializer):
    cat = AllegationCategorySerializer(read_only=True)
    crid = serializers.CharField(source='allegation.crid')
    incident_date = serializers.DateTimeField(
        source='allegation.incident_date')

    class Meta:
        model = OfficerAllegation
        fields = (
            'id',
            'crid',
            'cat',
            'incident_date',
            'final_finding',
            'final_outcome_class'
        )


class OfficerAllegationDataSerializer(serializers.Serializer):
    data = OfficerAllegationSerializer()
    allegation_counts = \
        serializers.ListField(child=serializers.IntegerField())
