from django.http import HttpResponse
from django.views.generic.base import View


class SunburstImageView(View):
    def get(self, request, hash_id=None):
        return HttpResponse('')
