from django_extensions.db.fields.json import JSONField
from rest_framework import serializers

from share.models import Session


class SessionSerializer(serializers.HyperlinkedModelSerializer):
    serializer_field_mapping = serializers.HyperlinkedModelSerializer.serializer_field_mapping
    serializer_field_mapping[JSONField] = serializers.DictField

    class Meta:
        model = Session
        fields = ('hash_id',
                  'title',
                  'query',
                  'share_from',
                  'share_count',
                  'url',
                  'ip',
                  'user_agent'
                  )

    def get_extra_kwargs(self):
        kwargs = super(SessionSerializer, self).get_extra_kwargs()
        kwargs['url'] = {
            'lookup_url_kwarg': 'pk',
            'lookup_field': 'hash_id',
        }
        return kwargs
