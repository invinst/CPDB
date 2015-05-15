import json
import re

from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.db.models.functions import Concat
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.views.generic.list import ListView

from common.json_serializer import JSONSerializer
from common.models import Allegation, Officer, AllegationCategory


autocomplete_fields = [
    Officer._meta.get_field('officer_first'),
    Officer._meta.get_field('officer_last'),
    AllegationCategory._meta.get_field('category'),
    Allegation._meta.get_field('start_date'),
    Allegation._meta.get_field('end_date'),
    Allegation._meta.get_field('crid'),
    Allegation._meta.get_field('final_outcome'),
]
autocomplete_field_verbose = [x.verbose_name for x in autocomplete_fields]
autocomplete_field_names = [x.name for x in autocomplete_fields]
autocomplete_field_verbose_to_names = dict(zip(autocomplete_field_verbose, autocomplete_field_names))
autocomplete_field_name_to_models = {x.name: x.model for x in autocomplete_fields}


class AllegationListView(ListView):
    model = Allegation
    template_name = 'allegation_list.html'

    def get_context_data(self, **kwargs):
        context = super(AllegationListView, self).get_context_data(**kwargs)
        context['autocomplete_json_url'] = reverse('allegation:autocomplete_json')
        context['searchable_fields'] = autocomplete_field_verbose
        return context


class AllegationAutocompleteJSONView(View):
    def get(self, request):
        suggestions = []
        if 'field' in request.GET and request.GET.get('field') in autocomplete_field_verbose:
            field = autocomplete_field_verbose_to_names[request.GET.get('field')]
            model = autocomplete_field_name_to_models[field]

            if 'query' in request.GET:
                suggestions = model.objects.all().filter(**{
                    field + '__icontains': request.GET.get('query')
                }).values_list(field, flat=True)
            else:
                suggestions = model.objects.all()[:10].values_list(field)

        return HttpResponse(json.dumps(list(suggestions), cls=DjangoJSONEncoder))


class AllegationAPIView(View):
    def get(self, request):
        try:
            start = int(request.GET.get('start', 0))
        except ValueError:
            start = 0
        length = 200

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

        fields = [
            'id',
            'crid',
            'incident_date',
            'cat',
            'officer__officer_last',
            'officer__officer_first'
        ]

        def concat_name(value):
            result = list(value[0:4])
            result.insert(2, "%s %s" % (value[4], value[5]))
            return result

        order_column = request.GET.get('order[0][column]')
        if order_column:
            order = fields[int(order_column)]
            if request.GET.get('order[0][dir]') == 'asc':
                allegations = allegations.order_by(order)
            else:
                allegations = allegations.order_by("-%s" % order)

        display_allegations = allegations[start:start+length].values_list(*fields)

        allegations_list = [concat_name(x) for x in display_allegations]

        content = JSONSerializer().serialize({
            'allegations': allegations_list,
            'iTotalRecords': Allegation.objects.all().count(),
            'iTotalDisplayRecords': allegations.count()
        })
        return HttpResponse(content)
