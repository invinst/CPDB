from django.http.response import JsonResponse, HttpResponseBadRequest
from allegation.views import AllegationAPIView
from common.models import Officer


class CountView(AllegationAPIView):
    def get(self, request):
        if 'by' not in request.GET:
            return HttpResponseBadRequest()
        by = request.GET.get('by')

        if by == 'num_complaints':
            allegations = super(CountView, self).get_allegations()
            count = Officer.count_by_num_complaints(allegations)

            return JsonResponse(count, safe=False)

        return HttpResponseBadRequest()
