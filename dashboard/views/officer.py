from rest_framework import viewsets

from allegation.utils.query import OfficerQuery
from api.serializers.officer_serializer import OfficerSerializer
from common.models import Officer
from dashboard.authentication import SessionAuthentication


class AdminOfficerViewSet(viewsets.ModelViewSet):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer
    authentication_classes = (SessionAuthentication,)

    def get_queryset(self):
        q = self.request.GET.get('q')
        if q:
            return Officer.objects.filter(OfficerQuery.condition_by_name(q))
        return super(AdminOfficerViewSet, self).get_queryset()
