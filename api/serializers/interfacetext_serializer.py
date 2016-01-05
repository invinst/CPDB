from rest_framework import serializers

from api.models import InterfaceText


class InterfaceTextSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterfaceText
