import json
from django.db.models.query_utils import Q
from django.http.response import HttpResponseBadRequest, HttpResponse
from django.views.generic.base import View
from common.models import Officer, AllegationCategory, Allegation


class SuggestView(View):
    autocomplete_category_names = {
        'officer_names': 'Officer name',
        'officer_badge_number': 'Badge number',
        'crid': 'Complaint ID',
        'category': 'Complaint type',
    }

    def get(self, request):
        q = request.GET.get('term', '')
        if not q:
            return HttpResponseBadRequest()

        ret = {}
        if q[0].isnumeric():
            condition = Q(star__icontains=q)
            results = self.query_suggestions(Officer, condition, ['star'])
            results = [int(x) for x in results]
            ret['officer_badge_number'] = results

            if len(q) >= 4:
                condition = Q(crid__icontains=q)
                results = self.query_suggestions(Allegation, condition, ['crid'])
                ret['crid'] = results
        else:
            condition = Q(officer_first__icontains=q) | Q(officer_last__icontains=q)
            results = self.query_suggestions(Officer, condition, ['officer_first', 'officer_last'])
            results = [x[0]+' '+x[1] for x in results]
            ret['officer_names'] = results

            condition = Q(category__icontains=q) | Q(allegation_name__icontains=q)
            results = self.query_suggestions(AllegationCategory, condition, ['category'])
            ret['category'] = results

        ret = self.to_jquery_ui_autocomplete_format(ret)
        ret = json.dumps(ret)
        return HttpResponse(ret)

    def query_suggestions(self, model_cls, cond, fields_to_get, limit=5):
        flat = True if len(fields_to_get) == 1 else False
        return list(model_cls.objects.filter(cond).values_list(*fields_to_get, flat=flat)[:limit])

    def to_jquery_ui_autocomplete_format(self, data):
        new_dict = {}
        for category in data:
            new_dict[category] = []
            for label in data[category]:
                new_dict[category].append({
                    'category': category,
                    'category_name': self.autocomplete_category_names[category],
                    'label': label
                })
        return new_dict
