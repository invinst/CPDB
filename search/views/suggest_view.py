from collections import OrderedDict
import json
from django.core.cache import cache

from django.http.response import HttpResponseBadRequest, HttpResponse
from django.views.generic.base import View
from search.models.suggestion import SuggestionLog

from search.services.suggestion import Suggestion
from search.services.suggestion_service import SuggestionService


class SuggestView(View):
    def track_suggestions_query(self, ret):
        total_results = sum([len(v) for k, v in ret.items()])
        term = self.request.GET.get('term', '')
        if 'current_session' in self.request.session:
            session_id = self.request.session['current_session']
        else:
            session_id = ''

        suggestion = SuggestionLog.objects.filter(session_id=session_id).order_by('-created_at').first()

        if suggestion and term.startswith(suggestion.search_query):
            suggestion.search_query = term
        else:
            suggestion = SuggestionLog(session_id=session_id,
                                       search_query=term,
                                       num_suggestions=total_results)

        suggestion.save()

    def get(self, request):
        q = request.GET.get('term', '').lower()
        if not q:
            return HttpResponseBadRequest()

        ret = SuggestionService().make_suggestion(q)

        if len(q) > 2:
            self.track_suggestions_query(ret)

        ret = json.dumps(ret)

        return HttpResponse(ret)
