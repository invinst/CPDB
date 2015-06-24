from django.http.response import HttpResponse
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from share.models import Session


class InitView(View):
    def get(self, request):
        session = Session()
        session.save()

        owned_sessions = request.session.get('owned_sessions', [])
        owned_sessions.append(session.id)
        request.session['owned_sessions'] = owned_sessions
        request.session.modified = True

        content = JSONSerializer().serialize({
            'session': {
                'hash_id': session.hash_id,
            }
        })

        return HttpResponse(content, content_type='application/json')
