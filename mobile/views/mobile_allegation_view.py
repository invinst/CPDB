from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from common.models import Allegation, ComplainingWitness, Officer
from mobile.serializers.mobile_allegation_view_serializer import MobileAllegationViewSerializer


class MobileAllegationView(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request):
        crid = request.GET.get('crid', '')
        allegations = Allegation.objects.filter(crid=crid)
        allegation = allegations.first()

        if not allegation:
            raise Http404()

        officer_ids = allegations.values_list('officer', flat=True)
        officers = Officer.objects.filter(id__in=officer_ids)
        complaining_witnesses = ComplainingWitness.objects.filter(crid=allegation.crid)

        content = MobileAllegationViewSerializer({
            'officers': officers,
            'allegation': allegation,
            'complaining_witnesses': complaining_witnesses
        })

        return Response(content.data)
