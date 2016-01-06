from django_extensions.db.fields.json import JSONField
from rest_framework import serializers

from common.models import Investigator


class InvestigatorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Investigator
        fields = (
                  'id',
                  'raw_name',
                  'name',
                  'complaint_count',
                  'discipline_count',
                  'current_rank'
                  )
