from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from common.models import Allegation, ComplainingWitness, Officer
from mobile.serializers.mobile_allegation_view_serializer import \
    MobileAllegationViewSerializer


class MobileOfficerAllegationView(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request):
        crid = request.GET.get('crid', '')
        allegation = Allegation.objects.get(crid=crid)

        if not allegation:
            raise Http404()

        officer_ids = allegation.officerallegation_set\
            .values_list('officer', flat=True)
        officers = Officer.objects.filter(id__in=officer_ids)\
            .order_by('-allegations_count')
        complaining_witnesses = ComplainingWitness.objects.filter(
            allegation__pk=allegation.pk)

        content = MobileAllegationViewSerializer({
            'officers': officers,
            'officer_allegation': allegation.officerallegation_set.all()[0],
            'complaining_witnesses': complaining_witnesses
        })

        return Response(content.data)
