from rest_framework import serializers

from mobile.serializers.allegation_serializer import AllegationSerializer
from mobile.serializers.officer_serializer import OfficerSerializer


class MobileSuggestionSerializer(serializers.Serializer):
    allegation = AllegationSerializer()
    officer_by_star = OfficerSerializer()
    officers_by_name = OfficerSerializer(many=True)
