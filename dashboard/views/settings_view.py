from rest_framework import viewsets

from api.serializers.setting_serializer import SettingSerializer
from dashboard.authentication import SessionAuthentication

from api.models import Setting


class AdminSettingsView(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    authentication_classes = (SessionAuthentication,)

    def setting_save(self, params):
        for setting_param in params:
            Setting.filter(id=setting_params.id).update(value=setting_params.value)