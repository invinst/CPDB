from django.db.models import Count

from rest_framework import viewsets, filters
from allegation.utils.date import tomorrow
from api.serializers.session_analytic_serializer import SessionAnalyticSerializer
from common.constants import START_UNIX_TIME_DATE, DATE_ONLY_FORMAT
from dashboard.authentication import SessionAuthentication
from share.models import Session


class AdminNewSessionsAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionAnalyticSerializer
    authentication_classes = (SessionAuthentication,)
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('created_date')
    ordering = ('created_date',)

    def get_queryset(self):
        begin = self.request.GET.get('begin', START_UNIX_TIME_DATE)
        end = self.request.GET.get('end', tomorrow().strftime(DATE_ONLY_FORMAT))

        query_set = super(AdminNewSessionsAnalyticsViewSet, self).get_queryset().filter(created_at__range=(begin, end))
        return query_set.extra({'created_date': 'date(created_at)'}).values('created_date').annotate(count=Count('id'))
