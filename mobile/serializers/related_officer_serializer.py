from rest_framework import serializers

from common.models import Officer


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
