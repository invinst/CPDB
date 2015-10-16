import json
from django.http.response import HttpResponse, HttpResponseBadRequest, Http404
from django.shortcuts import get_object_or_404
from django.views.generic import View

from common.json_serializer import JSONSerializer
from common.utils.http_request import get_client_ip
from share.models import Session


class SessionAPIView(View):
    def get(self, request):
        hash_id = request.GET.get('hash_id', '')

        if hash_id:
            ints = Session.id_from_hash(hash_id)
            if ints:
                session_id = ints[0]
                session = get_object_or_404(Session, pk=session_id)
                owned_sessions = request.session.get('owned_sessions', [])
                if session_id in owned_sessions:
                    return HttpResponse(JSONSerializer().serialize(
                        self.prepare_return_data(False, session)
                    ))
                else:
                    new_session = session.clone()
                    self.update_owned_session(request, new_session)
                    return HttpResponse(JSONSerializer().serialize(
                        self.prepare_return_data(False, new_session)
                    ))
            else:
                return HttpResponse(JSONSerializer().serialize({'data': {'msg': "Hash not found"}}), status=404)
        else:
            session = self.create_new_session(request)
            return HttpResponse(JSONSerializer().serialize(
                self.prepare_return_data(True, session)
            ))

    def post(self, request):
        data = json.loads(request.POST.get('request_data', {}))
        ints = Session.id_from_hash(data['hash'])
        owned_sessions = request.session.get('owned_sessions', [])

        if len(ints) < 1:
            return self.error_response('Hash not found')

        session_id = ints[0]

        if session_id not in owned_sessions:
            return self.error_response('Hash is not owned')

        session = Session.objects.filter(pk=session_id).first()
        if not session:
            return self.error_response('Session is not found')

        session = self.update_session_data(session, data)

        return HttpResponse(JSONSerializer().serialize(
            self.prepare_return_data(False, session)
        ), content_type='application/json')

    def create_new_session(self, request):
        session = Session()
        session.ip = get_client_ip(request)
        session.user_agent = request.user_agent
        session.save()
        request.session['current_session'] = session.hash_id
        self.update_owned_session(request, session)

        return session

    def update_owned_session(self, request, session):
        owned_sessions = request.session.get('owned_sessions', [])
        owned_sessions.append(session.id)
        request.session['owned_sessions'] = owned_sessions
        request.session['modified'] = True

    def prepare_return_data(self, is_new=False, session=None):
        return {
            'data': {
                'new': is_new,
                'hash': session.hash_id,
                'query': session.query,
                'readable_query': session.readable_query,
                'title': session.title
            }
        }

    def error_response(self, error_message):
         return HttpResponse(JSONSerializer().serialize({
                'data': {
                    'msg':  error_message
                }
            }), status=400)

    def update_session_data(self, session, data):
        updates = data['query'] or {}
        session.query.update(**updates)
        session.title = data['title'] or ''
        session.save()

        return session
