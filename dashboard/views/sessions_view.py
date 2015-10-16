from rest_framework import viewsets

from api.serializers.session_serializer import SessionSerializer
from dashboard.authentication import SessionAuthentication

from share.models import Session


class AdminSessionsView(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    authentication_classes = (SessionAuthentication,)

    def get_queryset(self):
        queryset = super(AdminSessionsView, self).get_queryset()
        query = self.request.GET.get('q', '')

        if query:
            queryset = queryset.filter(title__icontains=query.lower())

        return queryset.order_by('-created_at')
