from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from common.models import Allegation, ComplainingWitness, OfficerAllegation
from mobile.serializers.mobile_allegation_view_serializer import MobileAllegationViewSerializer


class MobileAllegationView(APIView):
    renderer_classes = (JSONRenderer,)

    def get(self, request):
        crid = request.GET.get('crid', '')

        try:
            allegation = Allegation.objects.prefetch_related('documents').get(crid=crid)
        except Allegation.DoesNotExist:
            raise Http404()

        complaining_witnesses = ComplainingWitness.objects.filter(allegation__pk=allegation.pk)
        officer_allegations = OfficerAllegation.objects.filter(allegation__pk=allegation.pk). \
            select_related('officer', 'cat', 'allegation')

        content = MobileAllegationViewSerializer({
            'allegation': allegation,
            'officer_allegations': officer_allegations,
            'complaining_witnesses': complaining_witnesses
        })

        return Response(content.data)
