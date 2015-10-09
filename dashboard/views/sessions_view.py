from rest_framework import viewsets

from api.serializers.session_serializer import SessionSerializer
from dashboard.authentication import SessionAuthentication

from share.models import Session


class AdminSessionsView(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    authentication_classes = (SessionAuthentication,)

    def get_queryset(self):
        return super(AdminSessionsView, self).get_queryset().order_by('-created_at')
