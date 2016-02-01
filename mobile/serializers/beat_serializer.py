from rest_framework import serializers

from common.models import Area


class BeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = (
            'name',
        )
