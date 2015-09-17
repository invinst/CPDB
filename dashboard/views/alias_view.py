from django.http.response import HttpResponse
from django.views.generic.base import View

from dashboard.forms.alias_form import AliasForm
from document.response import HttpResponseBadRequest


class AdminAliasApi(View):

    def post(self, request):
        form = AliasForm(request.POST)
        if not form.is_valid():
            return HttpResponseBadRequest(form=form)

        form.save()
        return HttpResponse(status=201)
