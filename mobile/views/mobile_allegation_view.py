from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from common.models import Allegation, ComplainingWitness
from mobile.serializers.mobile_allegation_view_serializer import MobileAllegationViewSerializer


class MobileAllegationView(APIView):
    renderer_classes = (JSONRenderer,)

    def get(self, request):
        crid = request.GET.get('crid', '')

        allegation = Allegation.objects.filter(crid=crid).prefetch_related('officerallegation_set__officer',
                                                                           'officerallegation_set__cat').first()

        if not allegation:
            raise Http404()

        complaining_witnesses = ComplainingWitness.objects.filter(allegation__pk=allegation.pk)

        content = MobileAllegationViewSerializer({
            'allegation': allegation,
            'complaining_witnesses': complaining_witnesses
        })

        return Response(content.data)
