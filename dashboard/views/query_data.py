from django.db.models.aggregates import Count
from django.views.generic.base import View

from document.response import JsonResponse
from search.models.suggestion import SuggestionLog


class AdminQueryDataApi(View):
    PER_PAGE = 15

    def get(self, request):
        page = int(request.GET.get('page', 0))
        start = page * self.PER_PAGE
        end = start + self.PER_PAGE

        logs = SuggestionLog.objects.all()

        if request.GET.get('fail'):
            logs = logs.filter(num_suggestions=0)

        if 'q' in request.GET:
            logs = logs.filter(query__istartswith=request.GET.get('q'))

        logs = logs.distinct('query')[start:end]
        queries = [x.query for x in logs]
        log_counts = SuggestionLog.objects.filter(query__in=queries).values_list('query').annotate(count=Count('query'))

        return JsonResponse({
            'data': logs,
            'usage': dict(log_counts),
        })
