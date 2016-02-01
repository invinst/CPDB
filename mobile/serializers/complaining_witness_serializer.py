from rest_framework import serializers

from common.models import ComplainingWitness


class ComplainingWitnessSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplainingWitness
        fields = (
            'cwit_id',
            'gender',
            'race',
            'age'
        )
