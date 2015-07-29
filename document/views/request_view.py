from django.http.response import HttpResponseBadRequest, JsonResponse
from django.views.generic.base import View
from document.forms import RequestEmailForm


class RequestView(View):
    def post(self, request):
        form = RequestEmailForm(request.POST)
        if not form.is_valid():
            return HttpResponseBadRequest()

        form.save()

        return JsonResponse({
            "success": True
        })
