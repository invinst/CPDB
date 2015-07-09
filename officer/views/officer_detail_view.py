from django.conf import settings
from django.shortcuts import render
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Officer, Allegation


class OfficerDetailView(View):
    def get(self, request, *args, **kwargs):

        officer_id = kwargs['pk']
        officer = Officer.objects.get(id=officer_id)
        allegations = Allegation.objects.filter(officer=officer)
        has_map = allegations.exclude(point=None).count() > settings.MAP_POINT_THRESHOLD
        officer_dict = JSONSerializer().serialize(officer)

        officers = {}
        related_officers = []
        for allegation in allegations:
            related = Allegation.objects.filter(crid=allegation.crid).exclude(pk=allegation.pk)
            for related_allegation in related:
                if related_allegation and related_allegation.officer:
                    if not related_allegation.officer.pk in officers:
                        officers[related_allegation.officer.pk] = 0
                    officers[related_allegation.officer.pk] += 1

                    if officers[related_allegation.officer.pk] > 1:
                        related_officers.append(related_allegation.officer.pk)

        related_officers = Officer.objects.filter(pk__in=related_officers).order_by('-allegations_count', '-discipline_count')
        related_officers = JSONSerializer().serialize(related_officers)

        return render(request, 'officer/officer_detail.html', {
            'officer': officer_dict,
            'allegations': allegations,
            'related_officers': related_officers,
            'has_map': has_map,
        })


