from django.http.response import JsonResponse
from django.views.generic.base import View

from document.forms import RequestEmailForm
from document.response import HttpResponseBadRequest


class RequestView(View):
    def post(self, request):
        form = RequestEmailForm(request.POST)
        if not form.is_valid():
            return HttpResponseBadRequest(form)

        form.save()

        return JsonResponse({
            "success": True
        })
