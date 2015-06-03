from django.http.response import JsonResponse, HttpResponseBadRequest
import math
from allegation.views import AllegationAPIView
from common.models import Officer
from cpdb.settings.base import GRAPH_DISTCURVE_NUM_X_TICKS, GRAPH_DISTCURVE_NUM_Y_TICKS


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

            x_ticks = CountView.calculate_ticks(count_summary, 'x')
            y_ticks = CountView.calculate_ticks(count_summary, 'y')

            res = {
                'col': count_summary,
                'ticks': {
                    'x': x_ticks,
                    'y': y_ticks
                }
            }
            return JsonResponse(res, safe=False)

        return HttpResponseBadRequest()

    @classmethod
    def calculate_ticks(cls, data_points, axis):
        if axis == 'x':
            max_val = data_points[-1]
            num_ticks = GRAPH_DISTCURVE_NUM_X_TICKS
        elif axis == 'y':
            max_val = max(data_points)
            num_ticks = GRAPH_DISTCURVE_NUM_Y_TICKS
        else:
            raise ValueError('Axis must be x or y')

        num_gaps = num_ticks - 1
        tick_distance = math.floor(max_val / num_gaps)
        ticks = [t * tick_distance for t in range(num_ticks)]

        return ticks
