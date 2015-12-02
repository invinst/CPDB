from rest_framework import serializers

from common.models import Investigator


class InvestigatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigator
        fields = (
            'name',
            'complaint_count',
            'discipline_count',
            'current_rank',
        )
