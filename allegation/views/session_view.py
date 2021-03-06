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

    def put(self, request):
        data = json.loads(request.body.decode("utf-8"))
        owned_sessions = request.session.get('owned_sessions', [])

        try:
            session_id = Session.id_from_hash(data['hash'])[0]
        except IndexError:
            return self.error_response('Hash not found')

        session = Session.objects.filter(pk=session_id).first()

        if not session:
            return self.error_response('Session is not found')
        if not session.shared and session_id not in owned_sessions:
            return self.error_response('Hash is not owned')

        session = self.update_session_data(session, data)

        return HttpResponse(JSONSerializer().serialize(
            self.prepare_return_data(False, session)
        ), content_type='application/json')

    def post(self, request):
        """Clone an existing session, marking the new session as "shared"."""
        try:
            session = get_object_or_404(Session, pk=Session.id_from_hash(request.POST['hash_id'])[0])
        except (KeyError, IndexError):
            return self.error_response('Bad parameters.')
        new_session = session.clone()
        new_session.shared = True
        new_session.save()
        return HttpResponse(JSONSerializer().serialize(
            self.prepare_return_data(True, new_session)
        ))

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
                'title': session.title,
                'active_tab': session.active_tab,
                'selected_sunburst_arc': session.selected_sunburst_arc,
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
        if 'query' in data:
            updates = data['query'] or {}
            if session.query != updates:
                session.query.update(**updates)
                self.track_filter(session)
        if 'active_tab' in data:
            session.active_tab = data['active_tab']
        if 'selected_sunburst_arc' in data:
            session.selected_sunburst_arc = data['selected_sunburst_arc']
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
                        'Area': [
                            {
                                'value': beat.id,
                                'filters': 'allegation__areas_id={id}'.format(id=beat.id),
                                'pinned': False
                            }
                        ]
                    }
                }
            )
            return HttpResponseRedirect(
                "/data/{session_hash}".format(session_hash=session.hash_id))

        return HttpResponseRedirect("/data/")
