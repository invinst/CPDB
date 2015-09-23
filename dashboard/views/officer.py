from django.db.models.query_utils import Q
from django.views.generic.base import View
from allegation.utils.query import OfficerQuery

from common.models import Officer
from document.response import JsonResponse


class AdminOfficerApi(View):
    PER_PAGE = 15

    def get(self, request):
        q = request.GET.get('q')
        officers = Officer.objects.filter(OfficerQuery.condition_by_name(q))

        return JsonResponse({
            'officers': officers
        })
