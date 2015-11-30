from django.http.response import HttpResponse, HttpResponseNotFound
from django.views.generic.base import View

from document.response import HttpResponseBadRequest
from share.models import Session


class AdminSessionAliasApi(View):
    def post(self, request):
        if not 'alias' in request.POST or not 'target' in request.POST:
            return HttpResponseBadRequest()

        alias = request.POST.get('alias')
        target = request.POST.get('target')
        try:
            session = Session.objects.get(id=target)
            session.alias = alias
            session.save()

            return HttpResponse(status=201)
        except Session.DoesNotExist:
            return HttpResponseNotFound()
