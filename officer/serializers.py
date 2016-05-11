from rest_framework import serializers

from common.models import Officer


class OfficerDetailSerializer(serializers.HyperlinkedModelSerializer):
    unit = serializers.CharField(source='unit.unit_name', read_only=True)

    class Meta:
        model = Officer
        fields = (
            'absolute_url',
            'active',
            'id',
            'officer_first',
            'officer_last',
            'gender',
            'race',
            'appt_date',
            'unit',
            'rank',
            'star',
            'allegations_count',
            'discipline_count',
            'birth_year',
            )
