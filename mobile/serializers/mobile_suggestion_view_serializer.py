from rest_framework import serializers

from common.models import Officer, Allegation, OfficerAllegation
from mobile.serializers.shared import AllegationCategorySerializer


class OfficerSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            'allegations_count',
            'race',
            'gender',
            'star'
        )


class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            'officer_first',
            'officer_last',
            'allegations_count'
        )


class OfficerAllegationSuggestionSerializer(serializers.ModelSerializer):
    cat = AllegationCategorySerializer()
    officer = OfficerSerializer()

    class Meta:
        model = OfficerAllegation
        fields = (
            'officer',
            'start_date',
            'end_date',
            'final_finding',
            'cat'
        )


class AllegationSuggestionSerializer(serializers.ModelSerializer):
    officer_allegations = OfficerAllegationSuggestionSerializer(many=True, source='officerallegation_set')

    class Meta:
        model = Allegation
        fields = (
            'crid',
            'incident_date',
            'officer_allegations'
        )


class SuggestionMetaSerializer(serializers.Serializer):
    def to_representation(self, value):
        if 'officer' in value:
            serializer = OfficerSuggestionSerializer(value['officer'])
        elif 'allegation' in value:
            serializer = AllegationSuggestionSerializer(value['allegation'])
        else:
            raise Exception('Unexpected type of suggestion object')

        return serializer.data


class MobileSuggestionViewSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=200)
    url = serializers.URLField()
    resource = serializers.CharField(max_length=20)
    resource_key = serializers.CharField(max_length=20)
    meta = SuggestionMetaSerializer()
