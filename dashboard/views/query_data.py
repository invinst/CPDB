from django.db.models.aggregates import Count
from django.views.generic.base import View

from document.response import JsonResponse
from search.models.suggestion import SuggestionLog


class AdminQueryDataApi(View):

    def get(self, request):
        start = int(request.GET.get('start', 0))
        end = int(request.GET.get('end', 5))

        logs = SuggestionLog.objects.all().distinct('query')[start:end]
        queries = [x.query for x in logs]
        log_counts = SuggestionLog.objects.filter(query__in=queries).values_list('query').annotate(count=Count('query'))

        return JsonResponse({
            'logs': logs,
            'log_counts': dict(log_counts),
        })
