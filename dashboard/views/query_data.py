import json
import datetime
from django.db import connection
from django.db.models.aggregates import Count, Max
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.generic.base import View

from search.models.suggestion import SuggestionLog


class AdminQueryDataApi(View):
    PER_PAGE = 15
    SUPPORTED_SORT_ORDER = ['query', 'num_usage', 'updated_at']

    def order_by(self, order_by):
        if order_by.startswith('-'):
            order = 'DESC'
        else:
            order = 'ASC'

        order_by = order_by.replace('-', '')

        if order_by not in self.SUPPORTED_SORT_ORDER:
            raise Exception('Unknown sort order')

        return order, order_by

    def build_result_entry_from_log(self, log):
        result = {}
        result['query'] = log[0]
        result['num_usage'] = log[1]
        result['updated_at'] = str(log[2])
        result['num_suggestions'] = log[3]

        return result

    def num_suggestion_condition(self, fail=False):
        condition_query = ''

        if fail:
            condition_query = 'AND num_suggestions=0'

        return condition_query

    def get(self, request):
        try:
            page = int(request.GET.get('page', 0))
            start = page * self.PER_PAGE
            q = request.GET.get('q', '').lower()
            order, order_by = self.order_by(request.GET.get('order_by') or 'query')
            additional_condition = self.num_suggestion_condition(request.GET.get('fail'))

            cursor = connection.cursor()
            cursor.execute('''
            SELECT DISTINCT query, COUNT(query) as num_usage, MAX(created_at) as updated_at, MAX(num_suggestions) as max_num_suggestions
            FROM search_suggestionlog
            WHERE lower(query) LIKE '%%%s%%' %s
            GROUP BY query ORDER BY %s %s OFFSET %d LIMIT %d
            ''' % (q, additional_condition, order_by, order, start, self.PER_PAGE))
            logs = cursor.fetchall()

            results = list(map(self.build_result_entry_from_log, logs))

            data = {
                'data': results
            }

            return HttpResponse(json.dumps(data))
        except Exception as e:
            return HttpResponseBadRequest(json.dumps({ 'error': str(e)}))
