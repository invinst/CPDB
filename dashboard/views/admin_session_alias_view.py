from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic.base import View

from document.response import HttpResponseBadRequest
from search.models.session_alias import SessionAlias
from share.models import Session


class AdminSessionAliasApi(View):
    def post(self, request):
        if 'alias' not in request.POST or 'target' not in request.POST:
            return HttpResponseBadRequest()

        alias = request.POST.get('alias')
        target = request.POST.get('target')
        session = get_object_or_404(Session, id=target)
        SessionAlias.objects.create(alias=alias, session=session)

        return HttpResponse(status=201)
