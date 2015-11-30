from django_extensions.db.fields.json import JSONField
from rest_framework import serializers
from api.serializers.suggestion_log_serializer import SuggestionLogSerializer
from api.serializers.filter_log_serializer import FilterLogSerializer

from share.models import Session


class SessionSerializer(serializers.HyperlinkedModelSerializer):
    serializer_field_mapping = serializers.HyperlinkedModelSerializer.serializer_field_mapping
    serializer_field_mapping[JSONField] = serializers.DictField

    suggestion_logs = SuggestionLogSerializer(
        source='get_suggestion_logs',
        read_only=True,
        many=True
    )

    filter_logs = FilterLogSerializer(
        source='get_filter_logs',
        read_only=True,
        many=True
    )

    class Meta:
        model = Session
        fields = ('hash_id',
                  'title',
                  'query',
                  'share_from',
                  'share_count',
                  'url',
                  'ip',
                  'user_agent',
                  'suggestion_logs',
                  'filter_logs',
                  'searchable',
                  'id',
                  )

    def get_extra_kwargs(self):
        kwargs = super(SessionSerializer, self).get_extra_kwargs()
        kwargs['url'] = {
            'lookup_url_kwarg': 'pk',
            'lookup_field': 'hash_id',
        }
        return kwargs
