from rest_framework import serializers

from common.models import Officer


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
