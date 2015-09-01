from rest_framework import viewsets

from api.serializers.session_serializer import SessionSerializer
from share.models import Session


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
