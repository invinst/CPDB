from rest_framework import serializers


class GlossaryTableRowSerializer(serializers.Serializer):
    term = serializers.CharField()
    definition = serializers.CharField()
    category = serializers.CharField()
