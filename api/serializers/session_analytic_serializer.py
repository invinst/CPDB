from rest_framework import serializers

from share.models import Session


class SessionAnalyticSerializer(serializers.ModelSerializer):
    created_date = serializers.DateTimeField()
    count = serializers.IntegerField()

    class Meta:
        model = Session
        fields  = (
            'created_date',
            'count'
        )
