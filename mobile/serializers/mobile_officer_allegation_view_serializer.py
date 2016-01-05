from rest_framework import serializers

from mobile.serializers.complaining_witness_serializer import \
    ComplainingWitnessSerializer
from mobile.serializers.full_officer_allegation_serializer import \
    FullOfficerAllegationSerializer
from mobile.serializers.officer_serializer import OfficerSerializer


class MobileOfficerAllegationViewSerializer(serializers.Serializer):
    complaining_witnesses = ComplainingWitnessSerializer(many=True)
    officer_allegation = FullOfficerAllegationSerializer()
    officers = OfficerSerializer(many=True)
