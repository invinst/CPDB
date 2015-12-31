from rest_framework import serializers


class SuggestibleSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=200)
    url = serializers.URLField()
    resource = serializers.CharField(max_length=20)
    resource_key = serializers.CharField(max_length=20)
    suggestion_type = serializers.CharField(max_length=20)
    meta = serializers.DictField()
