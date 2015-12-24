from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Officer
from mobile.exceptions.bad_request_api_exception import BadRequestApiException
from mobile.serializers.mobile_related_officer_view_seriallizer import MobileRelatedOfficerViewSerializer
from mobile.services.related_officer_service import RelatedOfficerService


class MobileRelatedOfficersView(APIView):
    def get(self, request):
        pk = request.GET.get('pk', '')

        try:
            officer = get_object_or_404(Officer, pk=pk)
        except ValueError:
            raise BadRequestApiException

        co_accused_officers = RelatedOfficerService.co_accused_officers(officer.pk)
        witness_officers = RelatedOfficerService.witness_officers(officer.pk)

        content = MobileRelatedOfficerViewSerializer({
            'co_accused': co_accused_officers,
            'witness': witness_officers
        })

        return Response(content.data)
