from rest_framework import viewsets

from api.serializers.session_serializer import SessionSerializer
from share.models import Session


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_object(self):
        if 'pk' in self.kwargs:
            self.kwargs['pk'] = Session.id_from_hash(self.kwargs['pk'])[0]
        return super(SessionViewSet, self).get_object()
