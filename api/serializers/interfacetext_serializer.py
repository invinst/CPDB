from rest_framework import serializers

from api.models import InterfaceText


class InterfaceTextSerializer(serializers.modelSerializer):

    class Meta:
        model = InterfaceText
