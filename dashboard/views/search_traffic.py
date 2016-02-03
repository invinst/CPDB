from collections import OrderedDict
import datetime
import json

from django.db import connection
from django.db.models.aggregates import Count
from django.http.response import HttpResponse
from django.views.generic.base import View

from search.models.suggestion import SuggestionLog


class AdminSearchTrafficApi(View):
    def get_top_queries(self, start_day, start, end):

        top_queries = SuggestionLog.objects.filter(created_at__gte=start_day).order_by('-count').values('search_query')
        top_queries = top_queries.annotate(count=Count('search_query'))
        return top_queries[start:end]

    def get_period(self, period, start_day, start=0, end=5):
        top_queries = self.get_top_queries(start_day, start, end)
        ret = {}
        periods = {
            'day': {'num_periods': 7, 'increment': 1, 'date_format': '%Y-%m-%d'},
            'week': {'num_periods': 8, 'increment': 7, 'date_format': "'%y Week %W"},
            'month': {'num_periods': 6, 'increment': 30, 'date_format': '%Y-%m'}
        }
        num_periods = periods[period]['num_periods']
        increment = periods[period]['increment']
        date_format = periods[period]['date_format']
        labels = OrderedDict()
        for i in range(num_periods):
            new_date = start_day + datetime.timedelta(days=(i*increment))
            labels[new_date.strftime(date_format)] = 0

        for top_query in top_queries:
            query = top_query['search_query']
            kursor = connection.cursor()
            sql = "SELECT count(*) as total, date_trunc(%s, created_at) as created_at_date " \
                "FROM search_suggestionlog " \
                "WHERE created_at >= %s AND search_query = %s " \
                "GROUP BY created_at_date " \
                "ORDER BY total DESC "

            kursor.execute(sql, [period, start_day, top_query['search_query']])

            for row in kursor.fetchall():
                label = row[1].strftime(date_format)
                labels[label] = row[0]

            ret[query] = {
                'labels': list(labels.keys()),
                'data': list(labels.values())
            }
        return ret

    def get(self, request):
        # fetch the most used search term over the last day, week, and month
        now = datetime.datetime.now()
        periods = {
            'day': now + datetime.timedelta(days=-7),
            'week': now + datetime.timedelta(days=-30),
            'month': now + datetime.timedelta(days=-180)
        }
        ret = {}

        for period in periods:
            ret[period] = self.get_period(period, periods[period])

        return HttpResponse(json.dumps(ret), content_type='application/json')
