from collections import OrderedDict

from django.db.models.query_utils import Q

from common.models import AllegationCategory, Allegation, Area, Investigator, Officer, FINDINGS, OUTCOMES, UNITS, GENDER, \
    RACES
from search.utils.date import *

# TODO: More test for this one, especially test for ensure the order, returned format
class Suggestion():
    def make_suggestion_format(self, match):
        return [match[1], match[0]]

    def suggest_rank(self, q):
        ranks = Officer.objects.order_by().values_list('rank', flat=True).distinct()
        # cast rank to str to ignore `None`
        return [rank for rank in ranks if str(rank).lower().startswith(q)]

    def suggest_unit_number(self, q):
        results = []
        matches = filter(lambda x: x[0].startswith(q), UNITS)

        for match in matches:
            results.append(self.make_suggestion_format(match))

        return results

    def suggest_unit(self, q):
        if q.isdigit():
            return self.suggest_unit_number(q)
        else:
            return self.suggest_in(q, UNITS)

    def suggest_incident_year_month(self, q):
        results = []

        for month in month_choices():
            if month[1].lower().startswith(q):
                results.append(generate_month_year_entry_from_2010(month))

        return results

    def suggest_officer_star(self, q):
        if not q.isnumeric():
            return None

        condition = Q(star__icontains=q)
        results = self.query_suggestions(Officer, condition, ['star'], order_bys=['star'])
        results = [int(x) for x in results]

        return results

    def suggest_crid(self, q):
        if not q.isnumeric() or len(q) < 4:
            return None

        condition = Q(crid__icontains=q)
        results = self.query_suggestions(Allegation, condition, ['crid'], order_bys=['crid'])
        return results

    def suggest_incident_date_only(self, q):
        if q.count('/') != 2:
            return None

        year, month, day = q.split("/")

        if year.isnumeric() and month.isnumeric():
            days = ["%02d" % x for x in range(1, 32)]
            results = ["%s/%s/%s" % (year, month, x) for x in days if x.startswith(day)]

            return results

    def suggest_incident_date_only_year(self, q):
        if q.count('/') != 0:
            return None

        return [x for x in range(2010, current_year()) if str(x).startswith(q)]

    def suggest_incident_date_only_year_month(self, q):
        if q.count('/') == 1:
            year, month = q.split("/")
            if year.isnumeric():
                months = ["%02d" % x for x in range(1, 13)]

                return ["%s/%s" % (year, x) for x in months if x.startswith(month)]

    def suggest_in(self, q, data):
        results = []
        for entry in data:
            if entry[1].lower().startswith(q):
                results.append([entry[1], entry[0]])

        return results

    def suggest_office_name(self, q):
        # suggestion for officer name
        parts = q.split(' ')
        if len(parts) > 1:
            condition = Q(officer_first__istartswith=parts[0]) & Q(officer_last__istartswith=" ".join(parts[1:]))
        else:
            condition = Q(officer_first__icontains=q) | Q(officer_last__icontains=q)
        results = self.query_suggestions(Officer, condition, ['officer_first', 'officer_last', 'allegations_count', 'id'],
                                         order_bys=('-allegations_count', 'officer_first', 'officer_last'))
        results = [["%s %s (%s)" % (x[0], x[1], x[2]), x[3] ] for x in results]
        return results

    def suggest_cat_category(self, q):
        condition = Q(category__icontains=q)
        return self.query_suggestions(AllegationCategory, condition, ['category'], order_bys=['-category_count'])

    def suggest_cat(self, q):
        condition = Q(allegation_name__icontains=q)
        return self.query_suggestions(AllegationCategory, condition, ['allegation_name', 'cat_id'],
                                         order_bys=['-allegation_count'])

    def suggest_investigator(self, q):
        condition = Q(name__icontains=q)
        results = self.query_suggestions(Investigator, condition, ['name', 'complaint_count', 'id'],
                                         order_bys=['-complaint_count'])
        results = [["%s (%s)" % (x[0], x[1]), x[2]] for x in results]
        return results

    def suggest_areas(self, q):
        condition = Q(name__icontains=q)
        results = self.query_suggestions(Area, condition, ['name', 'id', 'type'])

        return results

    def query_suggestions(self, model_cls, cond, fields_to_get, limit=5, order_bys=None):
        flat = True if len(fields_to_get) == 1 else False
        queryset = model_cls.objects.filter(cond).values_list(*fields_to_get, flat=flat)
        if order_bys:
            queryset = queryset.order_by(*order_bys)
        queryset = queryset.distinct()[:limit]
        return list(queryset)

    def make_suggestion(self, q):
        ret = OrderedDict()
        ret['incident_date_only__year_month'] = self.suggest_incident_year_month(q)
        ret['officer__star'] = self.suggest_officer_star(q)
        ret['crid'] = self.suggest_crid(q)
        ret['incident_date_only'] = self.suggest_incident_date_only(q)
        if q.count('/') == 1:
            ret['incident_date_only__year_month'] = self.suggest_incident_date_only_year_month(q)
        ret['incident_date_only__year'] = self.suggest_incident_date_only_year(q)
        ret['officer'] = self.suggest_office_name(q)
        ret['officer__unit'] = self.suggest_unit(q)
        ret['officer__rank'] = self.suggest_rank(q)
        ret['cat__category'] = self.suggest_cat_category(q)
        ret['cat'] = self.suggest_cat(q)
        ret['investigator'] = self.suggest_investigator(q)

        ret['final_outcome'] = self.suggest_in(q, OUTCOMES)
        ret['recc_outcome'] = ret['final_outcome']

        ret['final_finding'] = self.suggest_in(q, FINDINGS)
        ret['recc_finding'] = ret['final_finding']

        ret['areas__id'] = self.suggest_areas(q)

        ret['complainant_gender'] = self.suggest_in(q, GENDER)
        ret['complainant_race'] = self.suggest_in(q, RACES)

        ret['officer__gender'] = ret['complainant_gender']
        ret['officer__race'] = ret['complainant_race']

        ret = OrderedDict((k, v) for k, v in ret.items() if v)

        return ret
