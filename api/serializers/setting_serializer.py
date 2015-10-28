from django_extensions.db.fields.json import JSONField
from rest_framework import serializers

from api.models import Setting


class SettingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Setting
        fields = (
                  'id',
                  'key',
                  'value',
                  )