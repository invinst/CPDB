from rest_framework import serializers

from common.models import AllegationCategory


class AllegationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AllegationCategory
        fields = (
            'allegation_name',
            'category'
        )
