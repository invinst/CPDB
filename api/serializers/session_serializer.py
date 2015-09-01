from rest_framework import serializers

from share.models import Session


class SessionSerializer(serializers.HyperlinkedModelSerializer):

    query = serializers.DictField()

    class Meta:
        model = Session
        fields = ('hash_id',
                  'title',
                  'query',
                  'share_from',
                  'share_count',
                  )

