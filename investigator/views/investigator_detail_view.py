from django.views.generic.base import View
from django.shortcuts import get_object_or_404

from common.models import Investigator, OfficerAllegation
from document.response import JsonResponse
from investigator.services.investigator_details_service import \
    InvestigatorDetailsService


class InvestigatorDetailView(View):

    def get(self, request):
        investigator_id = request.GET.get('pk', 0)
        investigator = get_object_or_404(Investigator, pk=investigator_id)

        details = InvestigatorDetailsService.get_details(investigator)

        return JsonResponse(
            data={
                'investigator': investigator,
                'num_disciplined': details['num_disciplined'],
                'num_allegations': details['num_allegations'],
                'allegations': details['allegations'],
                'timeline': details['timeline'],
                'has_map': details['has_map']
            },
            safe=False
        )
