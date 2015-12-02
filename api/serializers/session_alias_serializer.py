from django.forms.models import model_to_dict
from rest_framework import serializers

from search.models.session_alias import SessionAlias


class SessionAliasSerializer(serializers.ModelSerializer):
    session = serializers.SerializerMethodField('session_data')

    class Meta:
        model = SessionAlias
        fields = ('id', 'alias', 'session', 'url')

    def session_data(self, obj):
        data = model_to_dict(obj.session)
        del data['id']
        data['hash_id'] = obj.session.hash_id
        return data
