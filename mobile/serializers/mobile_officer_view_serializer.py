from rest_framework import serializers

from common.models import Officer, OfficerAllegation
from mobile.serializers.shared import AllegationCategorySerializer


class FullOfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            'id',
            'officer_first',
            'officer_last',
            'unit',
            'allegations_count',
            'discipline_count',
            'rank',
            'appt_date',
            'star',
            'race',
            'gender'
        )


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


class RelatedOfficerSerializer(serializers.ModelSerializer):
    num_allegations = serializers.IntegerField(
        read_only=True
    )

    class Meta:
        model = Officer
        fields = (
            'id',
            'officer_first',
            'officer_last',
            'race',
            'gender',
            'num_allegations',
            'allegations_count'
        )


class MobileOfficerViewSerializer(serializers.Serializer):
    detail = FullOfficerSerializer()
    complaints = OfficerAllegationDataSerializer(many=True)
    co_accused = RelatedOfficerSerializer(many=True)
    distribution = serializers.ListField(
        child=serializers.IntegerField()
    )
