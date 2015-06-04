from django.http.response import JsonResponse, HttpResponseBadRequest
from allegation.views import AllegationAPIView
from common.models import Officer


class CountView(AllegationAPIView):
    def get(self, request):
        if 'by' not in request.GET:
            return HttpResponseBadRequest()
        by = request.GET.get('by')

        if by == 'num_complaints':
            allegations = self.get_allegations()
            officer_list = Officer.objects.filter(id__in=allegations.values('officer').distinct())
            count_by_officer = officer_list.values_list('allegations_count', flat=True)

            try:
              max_allegation_count = max(count_by_officer)
            except ValueError:
              count_summary = [0]
            else:
              count_summary = list(range(max_allegation_count + 1))
              for count in count_by_officer:
                count_summary[count] += 1
            return JsonResponse(count_summary, safe=False)

        return HttpResponseBadRequest()
