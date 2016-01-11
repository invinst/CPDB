import json

from django.contrib.gis.geos.point import Point
from django.http import QueryDict
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views.generic import View

from allegation.query_builders import OfficerAllegationQueryBuilder
from common.json_serializer import JSONSerializer
from common.models import Area, OfficerAllegation
from common.utils.http_request import get_client_ip
from search.models import FilterLog
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
                'title': session.title,
                'active_tab': session.active_tab,
                'sunburst_arc': session.sunburst_arc,
            }
        }

    def error_response(self, error_message):
        return HttpResponse(JSONSerializer().serialize({
            'data': {
                'msg':  error_message
            }
            }), status=400)

    def track_filter(self, session):
        if not session.query:
            return
        query_string = session.query_string
        if not query_string or query_string == '&':
            return

        queries = OfficerAllegationQueryBuilder()\
            .build(QueryDict(query_string))
        officer_allegations = OfficerAllegation.objects.filter(queries)
        num_allegations = officer_allegations.count()

        FilterLog.objects.create(tag_name=query_string,
                                 session_id=session.hash_id,
                                 num_allegations=num_allegations)

    def update_session_data(self, session, data):
        updates = data['query'] or {}
        if session.query != updates:
            session.query.update(**updates)
            self.track_filter(session)
        if 'active_tab' in data:
            session.active_tab = data['active_tab']
        if 'sunburst_arc' in data:
            session.sunburst_arc = data['sunburst_arc']
        if 'title' in data:
            session.title = data['title']
        session.save()

        return session


class InitSession(SessionAPIView):
    def get(self, request):
        lat = float(request.GET.get('lat', 41.850033))
        lng = float(request.GET.get('lng', -87.6500523))

        point = Point(lng, lat)
        beats = Area.objects.filter(
            type='police-beats', polygon__contains=point)

        if beats.exists():
            beat = beats.first()

            session = Session.objects.create(
                title="Police Beat %s" % beat.name,
                query={
                    'filters': {
                        'allegation__areas__id': {
                            'value': [beat.id]
                        }
                    }
                }
            )
            return HttpResponseRedirect(
                "/data/{session_hash}".format(session_hash=session.hash_id))

        return HttpResponseRedirect("/data/")
