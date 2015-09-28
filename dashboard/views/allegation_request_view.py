from django.db.models.query_utils import Q
from rest_framework import viewsets

from api.serializers.allegation_request_serializer import AllegationRequestSerializer
from common.models import Officer, Allegation
from dashboard.authentication import SessionAuthentication


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
        query_set = query_set.filter(self.filters[self.request.GET['type']])
        return query_set
