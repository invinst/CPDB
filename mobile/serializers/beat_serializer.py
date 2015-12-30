from rest_framework import serializers

from common.models import Area


class BeatSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display')

    class Meta:
        model = Area
        fields = (
            'name',
            'id',
            'type_display',
        )
