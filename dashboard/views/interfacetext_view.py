from rest_framework import viewsets

from api.serializers.interfacetext_serializer import InterfaceTextSerializer
from dashboard.authentication import SessionAuthentication

from api.models import InterfaceText


class InterfaceTextView(viewsets.ModelViewSet):
    queryset = InterfaceText.objects.all()
    serializer_class = InterfaceTextSerializer
    authentication_classes = (SessionAuthentication,)
