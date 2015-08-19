from rest_framework import viewsets
from api.serializers.officer_serializer import OfficerSerializer
from common.models import Officer


class OfficerViewSet(viewsets.ModelViewSet):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer
