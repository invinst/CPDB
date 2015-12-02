from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Allegation, Officer
from mobile.exceptions.bad_request_api_exception import BadRequestApiException
from mobile.serializers.mobile_officer_allegation_serializer import MobileOfficerAllegationViewSerializer


class MobileOfficerAllegationView(APIView):
    def get(self, request):
        pk = request.GET.get('pk', '')

        try:
            officer = get_object_or_404(Officer, pk=pk)
        except ValueError:
            raise BadRequestApiException

        allegations = Allegation.objects.filter(officer=officer)

        content = MobileOfficerAllegationViewSerializer({
            'allegations': allegations
        })

        return Response(content.data)
