from django.db.models.query_utils import Q
from rest_framework import viewsets

from api.serializers.allegation_request_serializer import AllegationRequestSerializer
from api.serializers.allegation_request_single_serializer import AllegationRequestSingleSerializer
from common.models import Allegation
from dashboard.authentication import SessionAuthentication
from document.models import RequestEmail


class AdminAllegationRequestViewSet(viewsets.ModelViewSet):
    queryset = Allegation.objects.all().distinct('crid')
    serializer_class = AllegationRequestSerializer
    authentication_classes = (SessionAuthentication,)

    filters = {
        "All": Q(),
        "Missing": Q(document_requested=False) & (Q(document_id=None) | Q(document_id=0)),
        "Requesting": Q(document_requested=True) & (Q(document_id=None) | Q(document_id=0)),
        "Fulfilled": Q(document_id__gt=0)
    }

    def get_queryset(self):
        query_set = super(AdminAllegationRequestViewSet, self).get_queryset()

        if 'crid' in self.request.GET:
            query_set = query_set.filter(crid=self.request.GET.get('crid'))
        else:
            query_set = query_set.filter(self.filters[self.request.GET.get('type', 'All')])

        return query_set

    def get_object(self):
        obj = super(AdminAllegationRequestViewSet, self).get_object()
        requests = RequestEmail.objects.filter(crid=obj.crid)
        queries = [x.session.readable_query for x in requests]
        obj.queries = queries
        return obj

    def get_serializer_class(self, *args, **kwargs):
        if self.kwargs.get('pk'):
            return AllegationRequestSingleSerializer
        return AllegationRequestSerializer
