from rest_framework import serializers

from api.models import Setting


class SettingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Setting
        fields = (
            'id',
            'default_site_title',
            'story_types_order',
            'requested_document_email_subject',
            'requested_document_email_text',
            'meta_description',
            'meta_keywords',
            )
