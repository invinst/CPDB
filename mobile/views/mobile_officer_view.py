from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from common.models import Officer
from mobile.exceptions.bad_request_api_exception import BadRequestApiException

from mobile.serializers.mobile_officer_view_serializer import MobileOfficerViewSerializer
from mobile.services.allegation_service import AllegationService
from mobile.services.related_officer_service import RelatedOfficerService


class MobileOfficerView(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request):
        pk = request.GET.get('pk', '')

        try:
            officer = get_object_or_404(Officer, pk=pk)
        except ValueError:
            raise BadRequestApiException

        content = MobileOfficerViewSerializer({
            'detail': officer,
            'co_accused': RelatedOfficerService.co_accused_officers(officer.pk),
            'complaints': AllegationService.get_officer_allegations(officer.pk)
        })

        return Response(content.data)
