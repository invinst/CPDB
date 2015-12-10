from rest_framework import serializers

from mobile.serializers.complaining_witness_serializer import ComplainingWitnessSerializer
from mobile.serializers.full_allegation_serializer import FullAllegationSerializer
from mobile.serializers.officer_serializer import OfficerSerializer


class MobileAllegationViewSerializer(serializers.Serializer):
    complaining_witnesses = ComplainingWitnessSerializer(many=True)
    allegation = FullAllegationSerializer()
    officers = OfficerSerializer(many=True)
