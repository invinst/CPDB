from rest_framework import serializers

from common.models import Officer


class OfficerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Officer
