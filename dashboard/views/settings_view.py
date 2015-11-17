from rest_framework import viewsets

from api.serializers.setting_serializer import SettingSerializer
from dashboard.authentication import SessionAuthentication

from api.models import Setting


class AdminSettingsView(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    authentication_classes = (SessionAuthentication,)
