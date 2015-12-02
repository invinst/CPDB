from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Allegation
from mobile.serializers.mobile_allegation_serializer import MobileAllegationViewSerializer


class MobileAllegationView(APIView):
    def get(self, request):
        crid = request.GET.get('crid', '')

        allegations = Allegation.objects.filter(crid=crid)

        if not allegations.exists():
            raise Http404()

        content = MobileAllegationViewSerializer({
            'allegation': allegations.first()
        })

        return Response(content.data)
