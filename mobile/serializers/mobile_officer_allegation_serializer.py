from rest_framework import serializers

from mobile.serializers.officer_allegation_serializer import AllegationSerializer


class MobileOfficerAllegationViewSerializer(serializers.Serializer):
    allegations = AllegationSerializer(many=True)
