from allegation.views.officer_allegation_api_view import \
    OfficerAllegationAPIView
from common.models import Officer
from document.response import JsonResponse


class CountView(OfficerAllegationAPIView):
    def get(self, request):
        officer_allegations = self.get_officer_allegations()
        officer_list = Officer.objects.filter(
            id__in=officer_allegations.values('officer').distinct())
        count_by_officer = officer_list.values_list(
            'allegations_count', flat=True)

        try:
            max_allegation_count = max(count_by_officer)
        except ValueError:
            count_summary = [0]
        else:
            count_summary = [0] * (max_allegation_count + 1)
            for count in count_by_officer:
                count_summary[count] += 1

        return JsonResponse(count_summary, safe=False)
