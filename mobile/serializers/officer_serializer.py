from rest_framework import serializers

from common.models import Officer


class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            'id',
            'officer_first',
            'officer_last',
            'race',
            'gender'
        )
