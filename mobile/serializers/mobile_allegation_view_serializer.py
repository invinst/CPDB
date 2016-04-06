from rest_framework import serializers

from common.models import Investigator, Area, ComplainingWitness, OfficerAllegation, Allegation, Officer

from mobile.serializers.shared import AllegationCategorySerializer


class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            'id',
            'officer_first',
            'officer_last',
            'race',
            'gender',
            'allegations_count'
        )


class InvestigatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigator
        fields = (
            'name',
            'complaint_count',
            'discipline_count',
            'current_rank',
        )


class GeoSerializer(serializers.Serializer):
    x = serializers.FloatField()
    y = serializers.FloatField()


class BeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = (
            'name',
        )


class ComplainingWitnessSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplainingWitness
        fields = (
            'cwit_id',
            'gender',
            'race',
            'age'
        )


class OfficerAllegationSerializer(serializers.ModelSerializer):
    officer = OfficerSerializer()
    cat = AllegationCategorySerializer(read_only=True)

    class Meta:
        model = OfficerAllegation
        fields = (
            'id',
            'officer',
            'cat',
            'start_date',
            'end_date',
            'final_finding',
            'final_outcome_class',
        )


class AllegationSerializer(serializers.ModelSerializer):
    beat = BeatSerializer()
    point = GeoSerializer()
    investigator = InvestigatorSerializer()
    document_id = serializers.SerializerMethodField('get_cr_document_id')
    document_normalized_title = serializers.SerializerMethodField('get_cr_normalized_title')

    def get_cr_document_id(self, obj):
        documents = obj.documents.all()
        for document in documents:
            if document.type == 'CR':
                return document.documentcloud_id
        return 0

    def get_cr_normalized_title(self, obj):
        documents = obj.documents.all()
        for document in documents:
            if document.type == 'CR':
                return document.normalized_title
        return ''

    class Meta:
        model = Allegation
        fields = (
            'crid',
            'investigator',
            'incident_date',
            'beat',
            'location',
            'add1',
            'add2',
            'city',
            'point',
            'document_id',
            'document_normalized_title'
        )


class MobileAllegationViewSerializer(serializers.Serializer):
    allegation = AllegationSerializer()
    complaining_witnesses = ComplainingWitnessSerializer(many=True)
    officer_allegations = OfficerAllegationSerializer(many=True)
