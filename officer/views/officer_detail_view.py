from django.conf import settings
from django.db.models.aggregates import Count
from django.http import HttpResponse
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Officer, PoliceWitness, OfficerAllegation


class OfficerDetailView(View):
    def get(self, request):
        officer_id = request.GET.get('pk')
        officer = Officer.objects.get(id=officer_id)
        officer_allegations = OfficerAllegation.objects.filter(officer=officer)
        has_map = officer_allegations.exclude(allegation__point__isnull=True).count() > \
            settings.MAP_POINT_THRESHOLD
        related_query = OfficerAllegation.objects.filter(
            allegation__pk__in=officer_allegations.values_list(
                'allegation__pk', flat=True))
        related_query = related_query.exclude(officer_id=officer_id).exclude(officer_id__isnull=True)
        related_officers_ordered = related_query.values('officer')\
            .annotate(total=Count('allegation__pk')).order_by('-total')

        related_witness = PoliceWitness.objects.filter(
            allegation__pk__in=officer_allegations.values_list(
                'allegation__pk', flat=True))
        related_witness = related_witness.exclude(officer_id=officer_id).exclude(officer_id__isnull=True)
        related_witness_ordered = related_witness.values('officer')\
            .annotate(total=Count('crid')).order_by('-total')

        related_officers = []
        for related_officer in related_officers_ordered:
            related_officers.append({
                'num_allegations': related_officer['total'],
                'witness': False,
                'officer': Officer.objects.get(pk=related_officer['officer'])
            })

        for witness in related_witness_ordered:
            related_officers.append({
                'num_allegations': witness['total'],
                'witness': True,
                'officer': Officer.objects.get(pk=witness['officer'])
            })

        related_officers = sorted(
            related_officers, key=lambda n: n['num_allegations'], reverse=True)

        return HttpResponse(JSONSerializer().serialize({
            'officer': officer,
            'officer_allegations': officer_allegations,
            'relatedOfficers': related_officers,
            'has_map': has_map
        }))
