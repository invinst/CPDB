from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Officer
from mobile.exceptions.bad_request_api_exception import BadRequestApiException
from mobile.serializers.full_officer_serializer import FullOfficerSerializer


class MobileOfficerView(APIView):
    def get(self, request):
        pk = request.GET.get('pk', '')

        try:
            officer = get_object_or_404(Officer, pk=pk)
        except ValueError:
            raise BadRequestApiException

        content = FullOfficerSerializer(officer)

        return Response(content.data)
