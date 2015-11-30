from rest_framework import serializers

from common.models import Officer
from mobile.serializers.allegation_serializer import AllegationSerializer
from mobile.serializers.officer_serializer import OfficerSerializer


class MobileSuggestionSerializer(serializers.Serializer):
    allegation = AllegationSerializer()
    officer_by_star = OfficerSerializer()
    officers_by_name = OfficerSerializer(many=True)

    class Meta:
        model = Officer
        fields = (
            'allegation',
            'officer_by_star',
            'officers_by_name',
            'race',
            'gender'
        )
