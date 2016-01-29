from django.db.models.query_utils import Q
from rest_framework import viewsets
from rest_framework import filters

from api.serializers.allegation_request_serializer import \
    AllegationRequestSerializer
from api.serializers.allegation_request_single_serializer import \
    AllegationRequestSingleSerializer
from common.models import Allegation
from dashboard.authentication import SessionAuthentication
from document.models import RequestEmail


DOCUMENT_REQUEST_FILTERS = {
    "All": Q(),
    "Missing":
        Q(document_requested=False) & (Q(document_id=None) | Q(document_id=0)),
    "Requested":
        Q(document_pending=False) & Q(document_requested=True) &
        (Q(document_id=None) | Q(document_id=0)),
    "Fulfilled": Q(document_id__gt=0),
    "Pending": Q(document_pending=True) & Q(document_requested=True),
}


class AdminAllegationRequestViewSet(viewsets.ModelViewSet):
    queryset = Allegation.objects.all()
    serializer_class = AllegationRequestSerializer
    authentication_classes = (SessionAuthentication,)
    filter_backends = (filters.OrderingFilter,)
    ordering = ('-number_of_request',)
    ordering_fields = ('last_requested', 'number_of_request',)

    def get_queryset(self):
        query_set = super(AdminAllegationRequestViewSet, self).get_queryset()

        if 'crid' in self.request.GET:
            query_set = query_set.filter(crid=self.request.GET.get('crid'))
        else:
            ids = Allegation.objects.all().distinct('crid')\
                .values_list('id', flat=True)
            query_set = query_set.filter(id__in=ids)
            query_set = query_set.filter(DOCUMENT_REQUEST_FILTERS[
                self.request.GET.get('type', 'All')])

        return query_set

    def get_object(self):
        obj = super(AdminAllegationRequestViewSet, self).get_object()
        requests = RequestEmail.objects.filter(crid=obj.crid)
        queries = [
            {'query': x.session.query.get('filters', {}), 'email': x.email}
            for x in requests]
        obj.queries = queries
        return obj

    def get_serializer_class(self, *args, **kwargs):
        if self.kwargs.get('pk'):
            return AllegationRequestSingleSerializer
        return AllegationRequestSerializer
