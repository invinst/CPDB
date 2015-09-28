from rest_framework import viewsets

from api.serializers.allegation_request_serializer import AllegationRequestSerializer
from common.models import Officer, Allegation
from dashboard.authentication import SessionAuthentication


class AdminAllegationRequestViewSet(viewsets.ModelViewSet):
    queryset = Allegation.objects.all().distinct('crid')
    serializer_class = AllegationRequestSerializer
    authentication_classes = (SessionAuthentication,)
