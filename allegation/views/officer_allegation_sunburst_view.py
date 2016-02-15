from allegation.views.officer_allegation_api_view import (
    OfficerAllegationAPIView)
from allegation.serializers import SunburstSerializer
from document.response import JsonResponse


class OfficerAllegationSunburstView(OfficerAllegationAPIView):
    def get(self, request):
        officer_allegations = self.get_officer_allegations(
            ignore_filters=['final_outcome', 'final_finding', 'final_finding_text'])
        output = SunburstSerializer(officer_allegations).data

        return JsonResponse({
            'sunburst': {
                'name': 'Allegations',
                'children': output,
            }
        })
