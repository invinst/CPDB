import json
from django.conf import settings
from django.core.urlresolvers import reverse
from django.db import connection
from django.db.models.query_utils import Q
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView
import re
from common.json_serializer import JSONSerializer
from common.models import Allegation, Officer


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation_list.html'

    def get_context_data(self, **kwargs):
        context = super(AllegationListView, self).get_context_data(**kwargs)
        context['autocomplete_json_url'] = reverse('allegation:autocomplete_json')
        return context


class AllegationAutocompleteJSONView(View):
    def get(self, request):
        suggestions = []
        if 'field' in request.GET:
            field = request.GET.get('field')
            if 'query' in request.GET:
                suggestions = Officer.objects.all().filter(**{
                    field + '__icontains': request.GET.get('query')
                }).values_list(field)
            else:
                suggestions = Officer.objects.all()[:10].values_list(field)

        return HttpResponse(json.dumps(list(suggestions)))


class AllegationAPIView(View):
    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
        except ValueError:
            page = 1
        allegations = Allegation.objects.all()

        if 'crid' in request.GET:
            crid = request.GET.get('crid')
            allegations = allegations.filter(crid=crid)

        if 'cat' in request.GET:
            cat = request.GET.get('cat')
            allegations = allegations.filter(cat=cat)

        if 'officer_name' in request.GET:
            name = request.GET.get('officer_name')
            name = name.strip()
            re.sub(r'\s{2,}', '\s', name)

            parts = name.split(' ')
            for part in parts:
                condition = Q(officer__officer_first__icontains=part) | Q(officer__officer_last__icontains=part)
            allegations = allegations.filter(condition)

        if 'final_outcome' in request.GET:
            final_outcome = request.GET.get('final_outcome')
            allegations = allegations.filter(final_outcome=final_outcome)

        if 'start_date' in request.GET:
            allegations = allegations.filter(start_date__gte=request.GET.get('start_date'))
        if 'end_date' in request.GET:
            allegations = allegations.filter(end_date__lte=request.GET.get('end_date'))

        start = (page - 1) * settings.ALLEGATION_LIST_ITEM_COUNT
        allegations = allegations[start:start+settings.ALLEGATION_LIST_ITEM_COUNT]
        content = JSONSerializer().serialize(allegations)
        return HttpResponse(content)
