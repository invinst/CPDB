from django.forms.models import model_to_dict
from rest_framework import serializers

from search.models.session_alias import SessionAlias


class SessionAliasSerializer(serializers.ModelSerializer):
    session = serializers.SerializerMethodField('session_data')
    user = serializers.SerializerMethodField('get_username')

    class Meta:
        model = SessionAlias
        fields = ('id', 'alias', 'session', 'user', 'url')

    def session_data(self, obj):
        data = model_to_dict(obj.session)
        del data['id']
        data['hash_id'] = obj.session.hash_id
        return data

    def get_username(self, obj):
        return obj.user.username
