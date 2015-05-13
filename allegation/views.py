from django.conf import settings
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView
from common.json_serializer import JSONSerializer
from common.models import Allegation


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation_list.html'


class AllegationAPIView(View):
    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
        except ValueError:
            page = 1
        allegations = Allegation.objects.all()
        start = (page - 1) * settings.ALLEGATION_LIST_ITEM_COUNT
        allegations = allegations[start:start+settings.ALLEGATION_LIST_ITEM_COUNT]
        content = JSONSerializer().serialize(allegations)
        return HttpResponse(content)
