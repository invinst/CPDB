from rest_framework import viewsets

from api.models import InterfaceText
from mobile.serializers.mobile_interfacetext_serializer import InterfaceTextSerializer


class MobileInterfaceTextView(viewsets.ModelViewSet):
    queryset = InterfaceText.objects.all()
    serializer_class = InterfaceTextSerializer
