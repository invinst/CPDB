from collections import OrderedDict
import datetime
import json

from django.db.models.query_utils import Q
from django.http.response import HttpResponseBadRequest, HttpResponse
from django.views.generic.base import View
from common.models import Officer, AllegationCategory, Complaint, OUTCOMES, FINDINGS


class SuggestView(View):
    autocomplete_category_names = {
        'crid': 'Complaint ID',
        'cat__category': 'Complaint type',
        'cat': 'Allegation type',
        'investigator': 'Investigator',
        'officer_id': 'Officer name',
        'officer__star': 'Badge number',
        'recc_outcome': 'Recommended Outcome',
        'recc_finding': 'Recommended Finding',
        'final_outcome': 'Final Outcome',
        'final_finding': 'Final Finding',
        'incident_date_only__year': 'Incident Year',
        'incident_date_only__year_month': 'Incident Year/Month',
        'incident_date_only': 'Incident Date',
    }

    def get(self, request):
        months_choices = []
        current_year = datetime.datetime.now().year
        date_format = "%Y-%m-%d"

        q = request.GET.get('term', '')
        if not q:
            return HttpResponseBadRequest()

        ret = OrderedDict()

        for i in range(1, 13):
            months_choices.append((i, datetime.date(2011, i, 1).strftime('%B')))
        results = []
        lower_q = q.lower()
        for month in months_choices:
            if month[1].lower().startswith(lower_q):
                for year in range(2010, current_year):
                    results.append(["%s %s" % (month[1], year),"%s-%s" % (year, month[0])])
        if results:
            ret['incident_date_only__year_month'] = results

        if q[0].isnumeric():
            condition = Q(star__icontains=q)
            results = self.query_suggestions(Officer, condition, ['star'], order_bys=['star'])
            results = [int(x) for x in results]
            if results:
                ret['officer__star'] = results

            if len(q) >= 4:
                condition = Q(crid__icontains=q)
                results = self.query_suggestions(Complaint, condition, ['crid'], order_bys=['crid'])
                if results:
                    ret['crid'] = results

            if '/' in q:
                count = q.count("/")
                if count == 2: # date
                    year, month, day = q.split("/")
                    if year.isnumeric() and month.isnumeric():
                        days = ["%02d" % x for x in range(1, 32)]
                        results = ["%s/%s/%s" % (year, month, x) for x in days if x.startswith(day)]
                        if results:
                            ret['incident_date_only'] = results
                elif count == 1: # month/year
                    year, month = q.split("/")
                    if year.isnumeric():
                        months = ["%02d" % x for x in range(1, 13)]
                        results = ["%s/%s" % (year, x) for x in months if x.startswith(month)]
                        if results:
                            ret['incident_date_only__year_month'] = results
            else: # only the year
                results = [x for x in range(2010, current_year) if str(x).startswith(q)]
                if results:
                    ret['incident_date_only__year'] = results
        else:
            # suggestion for officer name
            parts = q.split(' ')
            if len(parts) > 1:
                condition = Q(officer_first__istartswith=parts[0]) & Q(officer_last__istartswith=" ".join(parts[1:]))
            else:
                condition = Q(officer_first__icontains=q) | Q(officer_last__icontains=q)
            results = self.query_suggestions(Officer, condition, ['officer_first', 'officer_last', 'allegations_count', 'id'],
                                             order_bys=('-allegations_count', 'officer_first', 'officer_last'))
            results = [["%s %s (%s)" % (x[0], x[1], x[2]), x[3]] for x in results]
            if results:
                ret['officer_id'] = results

            condition = Q(category__icontains=q)
            results = self.query_suggestions(AllegationCategory, condition, ['category'], order_bys=['-category_count'])
            if results:
                ret['cat__category'] = results

            condition = Q(allegation_name__icontains=q)
            results = self.query_suggestions(AllegationCategory, condition, ['allegation_name', 'cat_id'],
                                             order_bys=['-allegation_count'])
            if results:
                ret['cat'] = results

            condition = Q(investigator__icontains=q)
            results = self.query_suggestions(Complaint, condition, ['investigator'])
            if results:
                ret['investigator'] = results

        results = []
        for outcome in OUTCOMES:
            if outcome[1].startswith(q):
                results.append([outcome[1], outcome[0]])

        if results:
            ret['final_outcome'] = results
            ret['recc_outcome'] = results

        results = []
        for finding in FINDINGS:
            if finding[1].startswith(q):
                results.append([finding[1], finding[0]])

        if results:
            ret['final_finding'] = results
            ret['recc_finding'] = results

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
        new_dict = OrderedDict()
        new_dict['categories'] = {}
        for category in data:
            new_dict[category] = []
            new_dict['categories'][category] = self.autocomplete_category_names[category]
            for label in data[category]:
                if isinstance(label, (list, tuple)):
                    value = label[1]
                    label = label[0]
                else:
                    value = label

                info = {
                    'category': category,
                    'category_name': self.autocomplete_category_names[category],
                    'label': label,
                    'value': value,
                }
                new_dict[category].append(info)
        return new_dict
