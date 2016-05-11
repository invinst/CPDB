from rest_framework import serializers

from common.models import Officer


class OfficerSerializer(serializers.HyperlinkedModelSerializer):
    unit = serializers.CharField(source='unit.unit_name', read_only=True)

    class Meta:
        model = Officer
        fields = ('absolute_url',
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
                  'url',
                  'birth_year',
                  )
