from collections import OrderedDict

from django.db.models.query_utils import Q

from allegation.utils.query import OfficerQuery
from common.models import AllegationCategory, Allegation, Area, Investigator, Officer, FINDINGS, OUTCOMES, UNITS, GENDER, \
    RACES, OUTCOME_TEXT_DICT, RANKS, HAS_FILTERS_LIST
from common.utils.hashid import hash_obj
from search.models.alias import Alias
from search.models.session_alias import SessionAlias
from search.utils.date import (
    month_choices, generate_month_year_entry_from_2010, current_year,
    START_SEARCHABLE_YEAR)
from search.utils.zip_code import get_zipcode_from_city
from search.services import REPEATER_DESC


AREA_SORT_ORDERS = {
    'police-beats': 0, 'neighborhoods': 1, 'ward': 2, 'police-districts': 3,
    'school-grounds': 5}
DATA_SOURCES = ['FOIA', 'pre-FOIA']
SUGGEST_OFFICER_LIMIT = 20
# TODO: More test for this one, especially test for ensure the order, returned format


class Suggestion(object):
    def make_suggestion_format(self, match):
        return [match[1], match[0]]

    def suggest_zip_code(self, q):
        results = {}

        if not q.isdigit():
            return []

        condition = Q(city__icontains=q)
        cities = self.query_suggestions(
            model_cls=Allegation,
            cond=condition,
            fields_to_get=['city'])

        # Ugly way to remove the duplicated zip code
        for city in cities:
            zip_code = get_zipcode_from_city(city)
            results[zip_code] = city

        return [[code, results[code]] for code in results]

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
                results = results + generate_month_year_entry_from_2010(month)

        return results

    def suggest_officer_star(self, q):
        if not q.isnumeric():
            return None

        condition = Q(star__icontains=q)
        results = self.query_suggestions(
            model_cls=Officer,
            cond=condition,
            fields_to_get=['star'],
            order_bys=['star'])
        results = [int(x) for x in results]

        return results

    def suggest_crid(self, q):
        if not q.isnumeric() or len(q) < 4:
            return None

        condition = Q(crid__icontains=q)
        results = self.query_suggestions(
            model_cls=Allegation,
            cond=condition,
            fields_to_get=['crid'],
            order_bys=['crid'])
        return results

    def suggest_incident_date_only(self, q):
        if q.count('/') != 2:
            return None

        year, month, day = q.split("/")

        if year.isnumeric() and month.isnumeric():
            days = ["%02d" % x for x in range(1, 32)]
            results = [
                "%s/%s/%s" % (year, month, x)
                for x in days if x.startswith(day)]

            return results

    def suggest_incident_date_only_year(self, q):
        if q.count('/') != 0:
            return None

        return [
            x for x in range(START_SEARCHABLE_YEAR, current_year() + 1)
            if str(x).startswith(q)]

    def suggest_incident_date_only_year_month(self, q):
        if q.count('/') == 1:
            year, month = q.split("/")
            if year.isnumeric():
                months = ["%02d" % x for x in range(1, 13)]

                return [
                    "%s/%s" % (year, x) for x in months if x.startswith(month)]

    def suggest_in_custom(self, q, data):
        results = []
        for entry in data:
            text = data[entry]['text']
            if self._matched_query(text, q):
                results.append([text, entry])

        return results

    def suggest_in(self, q, data):
        results = []
        for entry in data:
            if self._matched_query(entry[1], q):
                results.append([entry[1], entry[0]])

        return results

    def suggest_office_name(self, q):
        # suggestion for officer name
        condition = OfficerQuery.condition_by_name(q)
        results = self.query_suggestions(
            model_cls=Officer,
            cond=condition,
            fields_to_get=(
                'officer_first', 'officer_last', 'allegations_count', 'id'),
            order_bys=('-allegations_count', 'officer_first', 'officer_last'),
            limit=SUGGEST_OFFICER_LIMIT)
        results = [
            ["%s %s (%s)" % (x[0], x[1], x[2]), x[3]] for x in results]
        return results

    def suggest_cat_category(self, q):
        condition = Q(category__icontains=q)
        return self.query_suggestions(
            model_cls=AllegationCategory,
            cond=condition,
            fields_to_get=['category'],
            order_bys=['-category_count'])

    def suggest_cat(self, q):
        condition = Q(allegation_name__icontains=q) | Q(cat_id__icontains=q)
        return self.query_suggestions(
            model_cls=AllegationCategory,
            cond=condition,
            fields_to_get=['allegation_name', 'id'],
            order_bys=['-allegation_count'])

    def suggest_cat_id(self, q):
        condition = Q(allegation_name__icontains=q) | Q(cat_id__icontains=q)
        return self.query_suggestions(
            model_cls=AllegationCategory,
            cond=condition,
            fields_to_get=['cat_id'],
            order_bys=['-allegation_count'])

    def suggest_investigator(self, q):
        condition = Q(name__icontains=q)
        results = self.query_suggestions(
            model_cls=Investigator,
            cond=condition,
            fields_to_get=['name', 'complaint_count', 'id'],
            order_bys=['-complaint_count'])
        results = [["%s (%s)" % (x[0], x[1]), x[2]] for x in results]
        return results

    def suggest_areas(self, q):
        condition = Q(name__icontains=q)

        results = self.query_suggestions(
            model_cls=Area,
            cond=condition,
            fields_to_get=['name', 'id', 'type'],
            limit=20)
        results.sort(key=lambda x: AREA_SORT_ORDERS.get(x[2], 4))

        return results[:5]

    def suggest_has_filters(self, q):
        if q.startswith('has'):
            results = []
            for val, filter_text in HAS_FILTERS_LIST:
                if filter_text[:len(q)] == q:
                    results.append([filter_text, val])
            return results

        return []

    def suggest_data_source(self, q):
        if q.startswith('pre') or q.startswith('foi'):
            return DATA_SOURCES
        return []

    def suggest_repeat_offenders(self, q):
        if q.startswith('rep'):
            return [[value, int(key)] for key, value in REPEATER_DESC.items()]
        return []

    def suggest_sessions(self, query, limit=5):
        session_aliases = SessionAlias.objects\
            .filter(alias__icontains=query)[:limit]
        suggestions = []
        for alias in session_aliases:
            suggestions.append(
                [alias.title, hash_obj.encode(alias.session_id)])

        return suggestions

    def query_suggestions(
            self, model_cls, cond, fields_to_get, limit=5, order_bys=None):
        flat = True if len(fields_to_get) == 1 else False
        queryset = model_cls.objects.filter(cond)\
            .values_list(*fields_to_get, flat=flat)
        if order_bys:
            queryset = queryset.order_by(*order_bys)
        queryset = queryset.distinct()[:limit]
        return list(queryset)

    def _make_suggestion(self, q):
        ret = OrderedDict()
        ret['incident_date_only__year_month'] = \
            self.suggest_incident_year_month(q)
        ret['officer__star'] = self.suggest_officer_star(q)
        ret['city'] = self.suggest_zip_code(q)
        ret['crid'] = self.suggest_crid(q)
        ret['incident_date_only'] = self.suggest_incident_date_only(q)
        if q.count('/') == 1:
            ret['incident_date_only__year_month'] = \
                self.suggest_incident_date_only_year_month(q)
        ret['incident_date_only__year'] = \
            self.suggest_incident_date_only_year(q)
        ret['officer'] = self.suggest_office_name(q)
        ret['officer__unit'] = self.suggest_unit(q)
        ret['cat__category'] = self.suggest_cat_category(q)
        ret['cat'] = self.suggest_cat(q)
        ret['cat__cat_id'] = self.suggest_cat_id(q)
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

        ret['officer__rank'] = self.suggest_in(q, RANKS)

        ret['outcome_text'] = self.suggest_in_custom(q, OUTCOME_TEXT_DICT)

        ret['data_source'] = self.suggest_data_source(q)

        ret['officer__allegations_count__gt'] = \
            self.suggest_repeat_offenders(q)

        ret['session'] = self.suggest_sessions(q)

        ret['has_filters'] = self.suggest_has_filters(q)

        ret = OrderedDict((k, v) for k, v in ret.items() if v)
        return ret

    def make_suggestion(self, q):
        aliases = Alias.objects.filter(alias__istartswith=q)[0:10]

        ret = OrderedDict()
        for alias in aliases:
            ret = self._make_suggestion(alias.target)

            if not alias.num_suggestions:
                alias.num_suggestions = sum([len(v) for k, v in ret.items()])
            alias.num_usage += 1
            alias.save()

        ret_append = self._make_suggestion(q)

        for key in ret_append:
            if key in ret:
                ret[key] = ret[key] + ret_append[key]
            else:
                ret[key] = ret_append[key]

        return ret

    def _matched_query(self, s, q):
        return str(q).lower() in str(s).lower()
