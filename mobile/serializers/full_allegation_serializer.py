from rest_framework import serializers

from common.models import Allegation
from mobile.serializers.allegation_category_serializer import AllegationCategorySerializer
from mobile.serializers.beat_serializer import BeatSerializer
from mobile.serializers.geo_serializer import GeoSerializer
from mobile.serializers.investigator_serializer import InvestigatorSerializer


class FullAllegationSerializer(serializers.ModelSerializer):
    cat = AllegationCategorySerializer(read_only=True)
    investigator = InvestigatorSerializer()
    point = GeoSerializer()
    beat = BeatSerializer()

    class Meta:
        model = Allegation
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
        )
