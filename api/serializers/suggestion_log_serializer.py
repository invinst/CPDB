from django_extensions.db.fields.json import JSONField
from rest_framework import serializers

from search.models import SuggestionLog


class SuggestionLogSerializer(serializers.HyperlinkedModelSerializer):
    serializer_field_mapping = serializers.HyperlinkedModelSerializer.serializer_field_mapping
    serializer_field_mapping[JSONField] = serializers.DictField

    class Meta:
        model = SuggestionLog
        fields = (
            'search_query',
            'num_suggestions',
            'created_at',
        )
