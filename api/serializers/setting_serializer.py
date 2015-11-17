from django_extensions.db.fields.json import JSONField
from rest_framework import serializers

from api.models import Setting


class SettingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Setting
        fields = (
                  'id',
                  'default_site_title',
                  'story_types_order',
                  )
