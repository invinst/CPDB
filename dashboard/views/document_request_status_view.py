from django.views.generic.base import View
from dashboard.forms import DocumentRequestStatusForm
from document.response import JsonResponse, HttpResponseBadRequest


class DocumentRequestStatusView(View):
    def post(self, request):
        form = DocumentRequestStatusForm(request.POST)
        if not form.is_valid():            
            return HttpResponseBadRequest(form=form)

        form.process()

        return JsonResponse()