from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic.base import View
from rest_framework import viewsets

from api.serializers.session_alias_serializer import SessionAliasSerializer
from dashboard.authentication import SessionAuthentication
from document.response import HttpResponseBadRequest
from search.models.session_alias import SessionAlias
from share.models import Session


class AdminSessionAliasApi(View):
    def post(self, request):
        if 'alias' not in request.POST or 'target' not in request.POST:
            return HttpResponseBadRequest()

        alias = request.POST.get('alias')
        target = request.POST.get('target')
        title = request.POST.get('title')

        if isinstance(target, str):
            hash_id = Session.parse_hash_from_link(target)
            target = Session.id_from_hash(hash_id)[0]

        session = get_object_or_404(Session, id=target)
        SessionAlias.objects.create(alias=alias,
                                    session=session,
                                    user=request.user,
                                    title=title or session.title)

        return HttpResponse(status=201)


class AdminSessionsAliasViewSet(viewsets.ModelViewSet):
    queryset = SessionAlias.objects.all()
    serializer_class = SessionAliasSerializer
    authentication_classes = (SessionAuthentication,)

    def get_queryset(self):
        queryset = super(AdminSessionsAliasViewSet, self).get_queryset()
        query = self.request.GET.get('q', '')
        session_id = Session.id_from_hash(query)

        if session_id:
            return queryset.filter(id=session_id[0])

        if query:
            queryset = queryset.filter(session__title__icontains=query.lower())

        return queryset
