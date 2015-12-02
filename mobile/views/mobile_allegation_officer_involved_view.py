from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Allegation, Officer
from mobile.serializers.officer_serializer import OfficerSerializer


class MobileAllegationOfficerInvolvedView(APIView):
    def get(self, request):
        crid = request.GET.get('crid', '')

        allegations = Allegation.objects.filter(crid=crid)

        if not allegations.exists():
            raise Http404()

        officer_ids = allegations.values_list('officer', flat=True)
        officers = Officer.objects.filter(id__in=officer_ids)

        content = OfficerSerializer(officers, many=True)
        return Response(content.data)
