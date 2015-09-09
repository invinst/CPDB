from rest_framework import serializers

from common.models import Officer


class OfficerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Officer
        fields = ('absolute_url',
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
                  )
