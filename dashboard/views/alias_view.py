from django.db.models.aggregates import Count
from django.http.response import HttpResponse
from django.views.generic.base import View

from dashboard.forms.alias_form import AliasForm
from document.response import HttpResponseBadRequest, JsonResponse
from search.models.alias import Alias
from search.models.suggestion import SuggestionLog



class AdminAliasApi(View):
    PER_PAGE = 15

    def post(self, request):
        form = AliasForm(request.POST)
        if not form.is_valid():
            return HttpResponseBadRequest(form=form)

        form.save()
        return HttpResponse(status=201)

    def get(self, request):
        page = int(request.GET.get('page', 0))
        start = page * self.PER_PAGE
        end = start + self.PER_PAGE

        aliases = Alias.objects.all()

        if 'q' in request.GET:
            aliases = aliases.filter(alias__istartswith=request.GET.get('q'))

        aliases = aliases[start:end]

        return JsonResponse({
            'data': aliases,
        })
