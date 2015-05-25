import json
from django.db.models.query_utils import Q
from django.http.response import HttpResponseBadRequest, HttpResponse
from django.views.generic.base import View
from common.models import Officer, AllegationCategory, Allegation


class SuggestView(View):
    autocomplete_category_names = {
        'officer_name': 'Officer name',
        'officer_badge_number': 'Badge number',
        'crid': 'Complaint ID',
        'category': 'Complaint type',
        'cat': 'Allegation type',
    }

    def get(self, request):
        q = request.GET.get('term', '')
        if not q:
            return HttpResponseBadRequest()

        ret = {}
        if q[0].isnumeric():
            condition = Q(star__icontains=q)
            results = self.query_suggestions(Officer, condition, ['star'], order_bys=['star'])
            results = [int(x) for x in results]
            ret['officer_badge_number'] = results

            if len(q) >= 4:
                condition = Q(crid__icontains=q)
                results = self.query_suggestions(Allegation, condition, ['crid'], order_bys=['crid'])
                ret['crid'] = results
        else:
            # suggestion for officer name
            parts = q.split(' ')
            if len(parts) > 1:
                condition = Q(officer_first__istartswith=parts[0]) & Q(officer_last__istartswith=" ".join(parts[1:]))
            else:
                condition = Q(officer_first__icontains=q) | Q(officer_last__icontains=q)
            results = self.query_suggestions(Officer, condition, ['officer_first', 'officer_last'],
                                             order_bys=('officer_first', 'officer_last'))
            results = [x[0]+' '+x[1] for x in results]
            ret['officer_name'] = results

            condition = Q(category__icontains=q)
            results = self.query_suggestions(AllegationCategory, condition, ['category'], order_bys=['category'])
            if len(results):
                ret['category'] = results

            condition = Q(allegation_name__icontains=q)
            results = self.query_suggestions(AllegationCategory, condition, ['allegation_name','cat_id'],
                                             order_bys=['allegation_name'])
            if len(results):
                ret['cat'] = results

        ret = self.to_jquery_ui_autocomplete_format(ret)
        ret = json.dumps(ret)
        return HttpResponse(ret)

    def query_suggestions(self, model_cls, cond, fields_to_get, limit=5, order_bys=None):
        flat = True if len(fields_to_get) == 1 else False
        queryset = model_cls.objects.filter(cond).values_list(*fields_to_get, flat=flat)
        if order_bys:
            queryset = queryset.order_by(*order_bys)
        queryset = queryset.distinct()[:limit]
        return list(queryset)

    def to_jquery_ui_autocomplete_format(self, data):
        new_dict = {
            'categories': {

            }
        }
        for category in data:
            new_dict[category] = []
            new_dict['categories'][category] = self.autocomplete_category_names[category]
            for label in data[category]:
                info = {
                    'category': category,
                    'category_name': self.autocomplete_category_names[category],
                    'label': label
                }
                new_dict[category].append(info)
        return new_dict
