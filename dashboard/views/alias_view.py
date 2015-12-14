import json
from django.http.response import HttpResponse
from django.views.generic.base import View

from dashboard.forms.alias_form import AliasForm
from dashboard.forms.session_alias_form import SessionAliasForm
from document.response import JsonResponse, HttpResponseBadRequest
from search.models.alias import Alias



class AdminAliasApi(View):
    PER_PAGE = 15
    SUPPORTED_SORT_ORDER = ['alias', 'num_usage', 'updated_at']

    def post(self, request):
        session_alias_form = SessionAliasForm(request.POST)
        if not session_alias_form.is_valid():
            form = AliasForm(request.POST)
            if not form.is_valid():
                return HttpResponseBadRequest(form=form)
            form.save()
        else:
            session_alias_form.save(request.user)

        return HttpResponse(status=201)

    def get(self, request):
        try:
            page = int(request.GET.get('page', 0))
            start = page * self.PER_PAGE
            end = start + self.PER_PAGE
            order_by = request.GET.get('order_by') or '-updated_at'

            if order_by.replace('-', '') not in self.SUPPORTED_SORT_ORDER:
                raise Exception('Unknown sort order')

            aliases = Alias.objects.all()

            if 'q' in request.GET:
                aliases = aliases.filter(alias__istartswith=request.GET.get('q'))

            aliases = aliases.order_by(order_by)[start:end]

            return JsonResponse({
                'data': aliases,
            })
        except Exception as e:
            return HttpResponse(json.dumps({
                'error': str(e),
            }))
