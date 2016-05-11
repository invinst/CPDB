from rest_framework import serializers

from common.models import Officer, OfficerAllegation, Allegation
from mobile.serializers.shared import AllegationCategorySerializer


class FullOfficerSerializer(serializers.ModelSerializer):
    unit = serializers.CharField(source='unit.unit_name', read_only=True)

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


class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            'id',
            'officer_first',
            'officer_last',
            'allegations_count'
        )


class OfficerAllegationSerializer(serializers.ModelSerializer):
    cat = AllegationCategorySerializer(read_only=True)
    officer = OfficerSerializer()

    class Meta:
        model = OfficerAllegation
        fields = (
            'id',
            'cat',
            'final_finding',
            'final_outcome_class',
            'officer'
        )


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


class ComplaintDataSerializer(serializers.ModelSerializer):
    officer_allegation_set = OfficerAllegationSerializer(many=True, source='officerallegation_set')

    class Meta:
        model = Allegation
        fields = (
            'crid',
            'incident_date',
            'officer_allegation_set'
        )


class MobileOfficerViewSerializer(serializers.Serializer):
    detail = FullOfficerSerializer()
    complaints = ComplaintDataSerializer(many=True)
    co_accused = RelatedOfficerSerializer(many=True)
    distribution = serializers.ListField(
        child=serializers.IntegerField()
    )
