import json
from django.http.response import HttpResponse
from django.views.generic.base import View

from api.serializers.setting_serializer import SettingSerializer
from dashboard.authentication import SessionAuthentication

from api.models import Setting


class SettingsSaveView(View):

    def post(self, request):
        for key, value in request.POST.items():
            Setting.objects.filter(key=key).update(value=value)

        response = { 'success': True }

        return HttpResponse(json.dumps(response), content_type='application/json', status=200)
