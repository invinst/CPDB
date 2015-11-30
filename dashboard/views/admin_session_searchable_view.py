from django.views.generic.base import View
from django.http import HttpResponseNotFound

from document.response import JsonResponse, HttpResponseBadRequest
from share.models import Session


class AdminSessionSearchableView(View):
    def post(self, request):
        if not 'hash_id' in request.POST or not 'enable' in request.POST:
            return HttpResponseBadRequest()

        hash_id = request.POST.get('hash_id')
        search_enable = True if int(request.POST.get('enable')) else False

        try:
            session_id = Session.id_from_hash(hash_id)[0]
        except IndexError:
            return HttpResponseNotFound()
        sessions = Session.objects.filter(id=session_id).update(searchable=search_enable)

        return JsonResponse({
            'hash_id': hash_id,
            'enable': search_enable
        })
