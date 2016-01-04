from rest_framework import serializers

from common.models import OfficerAllegation
from mobile.serializers.allegation_category_serializer import \
    AllegationCategorySerializer
from mobile.serializers.beat_serializer import BeatSerializer
from mobile.serializers.geo_serializer import GeoSerializer
from mobile.serializers.investigator_serializer import InvestigatorSerializer


class FullOfficerAllegationSerializer(serializers.ModelSerializer):
    cat = AllegationCategorySerializer(read_only=True)
    investigator = InvestigatorSerializer(source='allegation__investigator')
    point = GeoSerializer(source='allegation__point')
    beat = BeatSerializer(source='allegation__beat')
    crid = serializers.CharField(source='allegation__crid')
    incident_date = serializers.DateTimeField(
        source='allegation__incident_date')
    location = serializers.CharField(source='allegation__location')
    add1 = serializers.IntegerField(source='allegation__add1')
    add2 = serializers.CharField(source='allegation__add2')
    city = serializers.CharField(source='allegation__city')
    document_id = serializers.IntegerField(source='allegation__document_id')
    document_normalized_title = serializers.CharField(
        source='allegation__document_normalized_title')

    class Meta:
        model = OfficerAllegation
        fields = (
            'id',
            'crid',
            'cat',
            'start_date',
            'incident_date',
            'end_date',
            'final_finding',
            'final_outcome_class',
            'investigator',
            'beat',
            'location',
            'add1',
            'add2',
            'city',
            'point',
            'document_id',
            'document_normalized_title'
        )
