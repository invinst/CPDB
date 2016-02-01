import json

from django.db import connection
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.generic.base import View


class AdminQueryDataApi(View):
    PER_PAGE = 15
    SUPPORTED_SORT_ORDER = ['search_query', 'num_usage', 'updated_at']

    def order_by(self, order_by):
        order = 'DESC' if order_by.startswith('-') else 'ASC'
        order_by = order_by.replace('-', '')

        if order_by not in self.SUPPORTED_SORT_ORDER:
            raise Exception('Unknown sort order')

        return order, order_by

    def build_result_entry_from_log(self, log):
        return {
            'search_query': log[0],
            'num_usage': log[1],
            'updated_at': str(log[2]),
            'num_suggestions': log[3]
        }

    def num_suggestion_condition(self, fail=False):
        return 'AND num_suggestions=0' if fail else ''

    def get(self, request):
        try:
            page = int(request.GET.get('page', 0))
            start = page * self.PER_PAGE
            q = request.GET.get('q', '').lower()
            order, order_by = self.order_by(request.GET.get('order_by') or '-updated_at')
            additional_condition = self.num_suggestion_condition(request.GET.get('fail'))

            cursor = connection.cursor()
            cursor.execute('''
                SELECT DISTINCT search_query, COUNT(search_query) as num_usage, MAX(created_at) as updated_at,
                MAX(num_suggestions) as max_num_suggestions
                FROM search_suggestionlog
                WHERE lower(search_query) LIKE '%{search_query}%'
                AND char_length(search_query) > 2 {additional_condition}
                GROUP BY search_query ORDER BY {order_by} {order} OFFSET {start} LIMIT {limit}
                '''.format(
                    search_query=q,
                    additional_condition=additional_condition,
                    order_by=order_by,
                    order=order,
                    start=start,
                    limit=self.PER_PAGE
            ))
            logs = cursor.fetchall()

            results = list(map(self.build_result_entry_from_log, logs))

            data = {
                'data': results
            }

            return HttpResponse(json.dumps(data))
        except Exception as e:
            return HttpResponseBadRequest(json.dumps({'error': str(e)}))
