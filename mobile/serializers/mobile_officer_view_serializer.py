from rest_framework import serializers

from mobile.serializers.full_officer_serializer import FullOfficerSerializer
from mobile.serializers.officer_allegation_serializer import AllegationSerializer
from mobile.serializers.related_officer_serializer import RelatedOfficerSerializer


class MobileOfficerViewSerializer(serializers.Serializer):
    detail = FullOfficerSerializer()
    complaints = AllegationSerializer(many=True)
    co_accused = RelatedOfficerSerializer(many=True)
    witness = RelatedOfficerSerializer(many=True)

