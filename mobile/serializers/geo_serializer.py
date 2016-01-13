from rest_framework import serializers


class GeoSerializer(serializers.Serializer):
    x = serializers.FloatField()
    y = serializers.FloatField()
