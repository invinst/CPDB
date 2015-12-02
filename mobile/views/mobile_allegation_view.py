from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Allegation, ComplainingWitness
from mobile.serializers.mobile_allegation_view_serializer import MobileAllegationViewSerializer


class MobileAllegationView(APIView):
    def get(self, request):
        crid = request.GET.get('crid', '')
        allegation = Allegation.objects.filter(crid=crid).first()

        if not allegation:
            raise Http404()
        
        complaining_witnesses = ComplainingWitness.objects.filter(crid=allegation.crid)
        content = MobileAllegationViewSerializer({
            'allegation': allegation,
            'complaining_witnesses': complaining_witnesses
        })

        return Response(content.data)
