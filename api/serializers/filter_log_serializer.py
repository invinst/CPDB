from django_extensions.db.fields.json import JSONField
from rest_framework import serializers

from search.models import FilterLog


class FilterLogSerializer(serializers.HyperlinkedModelSerializer):
    serializer_field_mapping = serializers.HyperlinkedModelSerializer.serializer_field_mapping
    serializer_field_mapping[JSONField] = serializers.DictField

    class Meta:
        model = FilterLog
        fields = (
            'tag_name',
            'num_allegations',
            'created_at',
        )
