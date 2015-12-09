from rest_framework import serializers

from mobile.serializers.related_officer_serializer import RelatedOfficerSerializer


class MobileRelatedOfficerViewSerializer(serializers.Serializer):
    co_accused = RelatedOfficerSerializer(many=True)
    witness = RelatedOfficerSerializer(many=True)
