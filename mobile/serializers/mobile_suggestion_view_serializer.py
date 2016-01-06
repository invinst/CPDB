from rest_framework import serializers

from mobile.serializers.officer_allegation_serializer import \
    OfficerAllegationSerializer
from mobile.serializers.officer_serializer import OfficerSerializer


class MobileSuggestionViewSerializer(serializers.Serializer):
    officer_allegation = OfficerAllegationSerializer()
    officer_by_star = OfficerSerializer()
    officers_by_name = OfficerSerializer(many=True)
