from collections import OrderedDict
import json

from django.http.response import HttpResponseBadRequest, HttpResponse
from django.views.generic.base import View
from common.utils.http_request import get_client_ip
from search.models.suggestion import SuggestionLog

from search.services.suggestion import Suggestion


class SuggestView(View):
    def track_suggestions_query(self, ret):
        total_results = sum([len(v) for k, v in ret.items()])
        ip = get_client_ip(self.request)
        query = self.request.GET.get('term', '')
        session_id = self.request.session.session_key or ''
        suggestion = SuggestionLog.objects.filter(session_id=session_id).order_by('-created_at').first()

        if suggestion and query.startswith(suggestion.query):
            suggestion.query = query
        else:
            suggestion = SuggestionLog(session_id=session_id,
                                       query=query,
                                       num_suggestions=total_results, ip=ip)

        suggestion.save()

    def get(self, request):
        q = request.GET.get('term', '').lower()
        if not q:
            return HttpResponseBadRequest()

        ret = Suggestion().make_suggestion(q)
        if len(q) > 2:
            self.track_suggestions_query(ret)

        ret = self.to_jquery_ui_autocomplete_format(ret)
        ret = json.dumps(ret)
        return HttpResponse(ret)

    def to_jquery_ui_autocomplete_format(self, data):
        new_dict = OrderedDict()
        for category in data:
            new_dict[category] = []
            other = None
            for label in data[category]:
                if isinstance(label, (list, tuple)):
                    if len(label) > 2:
                        other = label[2]
                    value = label[1]
                    label = label[0]
                else:
                    value = label

                info = {
                    'category': category,
                    'label': label,
                    'value': value,
                }
                if other:
                    info['type'] = other
                new_dict[category].append(info)
        return new_dict
