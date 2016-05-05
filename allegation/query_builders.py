from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models.query_utils import Q
from haystack.query import SearchQuerySet

import inspect

from allegation.utils.query import OfficerQuery
from common.constants import FOIA_START_DATE, DISCIPLINE_CODES, NO_DISCIPLINE_CODES
from common.models import Allegation


def _apply_all_query_methods(inst, query_params):
    queries = Q()

    for name, func in inspect.getmembers(inst, predicate=inspect.ismethod):
        if name[:3] == '_q_':
            queries &= func(query_params)

    return queries


class OfficerAllegationQueryBuilder(object):
    """
    Build Q queries from query params.

    Expose a single method: `build`
    """

    def build(self, query_params, ignore_params=None):
        """
        Take `query_params` and return a single Q object.

        Will run query_params through all methods begin with `_q_`
        and return the combined Q query.
        """
        query_params = self._exclude_ignore_params(query_params, ignore_params)
        queries = _apply_all_query_methods(self, query_params)
        return queries

    def _exclude_ignore_params(self, query_params, ignore_params):
        new_query_dict = query_params.copy()
        for key in (ignore_params or []):
            try:
                new_query_dict.pop(key)
            except KeyError:
                pass
        return new_query_dict

    def _q_adhoc_queries(self, query_params):
        queries = Q()
        ADHOC_QUERIES = [
            'id',
            'allegation__crid',
            'cat',
            'cat__cat_id',
            'recc_finding',
            'final_outcome',
            'final_outcome_class',
            'recc_outcome',
            'final_finding',
            'officer',
            'officer__star',
            'officer__rank',
            'officer__gender',
            'officer__race',
            'allegation__investigator',
            'cat__category',
            'allegation__city',
            'officer__active'
        ]

        for key in query_params.keys():
            if key in ADHOC_QUERIES:
                val_list = query_params.getlist(key)
                sub_queries = Q()
                for val in val_list:
                    val_lower = val.lower()
                    if val_lower in ('none', 'null'):
                        val = True
                        key = "%s__isnull" % key
                    if not sub_queries:
                        sub_queries = Q(**{key: val})
                    else:
                        sub_queries |= Q(**{key: val})
                if not queries:
                    queries = sub_queries
                else:
                    queries &= sub_queries

        return queries

    def _q_officer_unit(self, query_params):
        if 'officer__unit' in query_params:
            unit_name = query_params['officer__unit']
            return Q(officer__unit__unit_name=unit_name)
        return Q()

    def _q_areas_id(self, query_params):
        if 'allegation__areas__id' in query_params:
            val = query_params.getlist('allegation__areas__id')
            return Q(allegation__areas__id__in=val)
        return Q()

    def _q_officer_names(self, query_params):
        queries = Q()
        for name in query_params.getlist('officer_name', []):
            queries |= OfficerQuery.condition_by_name(name, prefix='officer__')
        return queries

    def _q_officer_allegation_count(self, query_params):
        if 'officer__allegations_count__gt' in query_params:
            officer_allegation_count = \
                query_params['officer__allegations_count__gt']
            return OfficerQuery.condition_by_count(
                officer_allegation_count,
                field='allegations_count',
                prefix='officer__')
        return Q()

    def _q_officer_discipline_count(self, query_params):
        if 'officer__discipline_count__gt' in query_params:
            officer_discipline_count = \
                query_params['officer__discipline_count__gt']
            return OfficerQuery.condition_by_count(
                officer_discipline_count,
                field='discipline_count',
                prefix='officer__')
        return Q()

    def _q_latlng(self, query_params):
        if 'latlng' in query_params:
            lat, lng = tuple(query_params['latlng'].split(','))
            radius = query_params.get('radius', 500)
            return Q(allegation__point__distance_lt=(
                Point(float(lng), float(lat)),
                D(m=radius)))
        return Q()

    def _q_has_document(self, query_params):
        if 'true' in query_params.getlist('has_document', []):
            return Q(allegation__documents__documentcloud_id__gt=0)
        return Q()

    def _q_has_map(self, query_params):
        if 'true' in query_params.getlist('has_map', []):
            return Q(allegation__point__isnull=False)
        return Q()

    def _q_has_address(self, query_params):
        if 'true' in query_params.getlist('has_address', []):
            return Q(allegation__add1__isnull=False) | \
                Q(allegation__add2__isnull=False)
        return Q()

    def _q_has_location(self, query_params):
        if 'true' in query_params.getlist('has_location', []):
            return Q(allegation__location__isnull=False)
        return Q()

    def _q_has_investigator(self, query_params):
        if 'true' in query_params.getlist('has_investigator', []):
            return Q(allegation__investigator__isnull=False)
        return Q()

    def _q_has_identified(self, query_params):
        if 'true' in query_params.getlist('has_identified', []):
            return Q(officer__isnull=False)
        return Q()

    def _q_has_summary(self, query_params):
        if 'true' in query_params.getlist('has_summary', []):
            return Q(allegation__summary__isnull=False)
        return Q()

    def _q_unsustained_final_finding(self, query_params):
        UNSUSTAINED_FINAL_FINDINGS = ['DS', 'EX', 'NA', 'NC', 'NS', 'UN', 'ZZ']
        if 'unsustained' in query_params.getlist('final_finding_text', []):
            return Q(final_finding__in=UNSUSTAINED_FINAL_FINDINGS)
        return Q()

    def _q_outcome_any_discipline(self, query_params):
        if 'any discipline' in query_params.getlist('outcome_text', []):
            return Q(final_finding='SU', final_outcome__in=DISCIPLINE_CODES)
        return Q()

    def _q_outcome_no_discipline(self, query_params):
        if 'no discipline' in query_params.getlist('outcome_text', []):
            return Q(final_finding='SU', final_outcome__in=NO_DISCIPLINE_CODES) | \
                Q(final_finding='SU', final_outcome__isnull=True)
        return Q()

    def _query_outcome_text(
            self, query_params, outcome_text, final_outcome__in):
        if outcome_text in query_params.getlist('outcome_text', []):
            return Q(final_outcome__in=final_outcome__in)
        return Q()

    def _q_outcome_1_9_days(self, query_params):
        return self._query_outcome_text(
            query_params, outcome_text='1-9 days',
            final_outcome__in=[str(x).zfill(3) for x in range(1, 10)])

    def _q_outcome_10_30_days(self, query_params):
        return self._query_outcome_text(
            query_params, outcome_text='10-30 days',
            final_outcome__in=[str(x).zfill(3) for x in range(10, 31)])

    def _q_outcome_30_more_days(self, query_params):
        FINAL_OUTCOMES_30_MORE_DAYS = ['045', '060', '090', '180', '200']
        return self._query_outcome_text(
            query_params, outcome_text='30 more days',
            final_outcome__in=FINAL_OUTCOMES_30_MORE_DAYS)

    def _query_by_complainant(self, query_params, param_key, query_key):
        if param_key in query_params:
            vals = query_params.getlist(param_key)
            return Q(**{'allegation__complainingwitness__%s' % query_key: vals})
        return Q()

    def _q_complainant_gender(self, query_params):
        return self._query_by_complainant(
            query_params, param_key='complainant_gender',
            query_key='gender__in')

    def _q_complainant_race(self, query_params):
        return self._query_by_complainant(
            query_params, param_key='complainant_race',
            query_key='race__in')

    def _q_incident_date_only(self, query_params):
        allegation_queries = Q()
        for date_range in query_params.getlist('incident_date_only__range'):
            date_range = date_range.split(',')
            allegation_queries |= Q(incident_date_only__range=date_range)

        for year in query_params.getlist('incident_date_only__year'):
            allegation_queries |= Q(incident_date_only__year=year)

        for year_month in \
                query_params.getlist('incident_date_only__year_month'):
            year_month = year_month.replace('/', '-')
            year, month = year_month.split('-')
            allegation_queries |= Q(
                incident_date_only__year=year, incident_date_only__month=month)

        dates = [
            date.replace('/', '-')
            for date in query_params.getlist('incident_date_only')]
        if dates:
            allegation_queries |= Q(incident_date_only__in=dates)

        allegation_ids = Allegation.objects.filter(allegation_queries)\
            .values_list('pk', flat=True)

        if allegation_ids:
            return Q(allegation__pk__in=allegation_ids)
        return Q()

    def _q_add_data_source_filter(self, query_params):
        data_source = query_params.getlist('data_source', [])

        if len(data_source) == 2:
            return Q()
        if 'pre-FOIA' in data_source:
            return (
                Q(allegation__incident_date__lt=FOIA_START_DATE) |
                Q(start_date__lt=FOIA_START_DATE) |
                Q(allegation__incident_date__isnull=True))
        elif 'FOIA' in data_source:
            return (
                Q(allegation__incident_date__gte=FOIA_START_DATE) |
                Q(start_date__gte=FOIA_START_DATE))

        return Q()

    def _q_investigator_agency(self, query_params):
        ranks = query_params.getlist('allegation__investigator__agency', [])
        if len(ranks) == 0:
            return Q()

        ranks = [x.lower() for x in ranks]

        if 'ipra' in ranks:
            return Q(allegation__investigator__agency__icontains='ipra')
        elif 'iad' in ranks:
            return Q(allegation__investigator__agency__icontains='iad')
        return Q()

    def _q_allegation_summary(self, query_params):
        terms = query_params.getlist('allegation_summary', [])
        if len(terms) == 0:
            return Q()

        sqs = SearchQuerySet()
        matched_allegation_ids = []
        for term in terms:
            raw_results = sqs.filter(allegation_summary__exact=term).values_list('pk', flat=True)
            casted_results = [int(x) for x in raw_results]
            matched_allegation_ids += casted_results

        return Q(allegation__pk__in=matched_allegation_ids)

    def _q_category_on_duty(self, query_params):
        duties = query_params.getlist('cat__on_duty', [])
        if len(duties) == 0:
            return Q()

        duties = [duty == 'true' for duty in duties]
        return Q(cat__on_duty__in=duties)

    def _q_complainant_age(self, query_params):
        age_ranges = query_params.getlist('complainant_age', [])
        queries = Q()
        for age_range in age_ranges:
            if age_range[0] == '<':
                queries |= Q(allegation__complainingwitness__age__lte=age_range[1:])
            elif age_range[0] == '>':
                queries |= Q(allegation__complainingwitness__age__gte=age_range[1:])
            else:
                ages = age_range.split('-')
                queries |= Q(
                    allegation__complainingwitness__age__gte=ages[0],
                    allegation__complainingwitness__age__lte=ages[1])

        return queries

    def _q_officer_age(self, query_params):
        age_ranges = query_params.getlist('officer_age', [])
        queries = Q()
        for age_range in age_ranges:
            if age_range[0] == '<':
                queries |= Q(officer_age__lte=age_range[1:])
            elif age_range[0] == '>':
                queries |= Q(officer_age__gte=age_range[1:])
            else:
                ages = age_range.split('-')
                queries |= Q(
                    officer_age__gte=ages[0],
                    officer_age__lte=ages[1])

        return queries
