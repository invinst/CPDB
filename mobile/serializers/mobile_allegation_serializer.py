from rest_framework import serializers

from mobile.serializers.allegation_detail_serializer import AllegationDetailSerializer


class MobileAllegationViewSerializer(serializers.Serializer):
    allegation = AllegationDetailSerializer()
