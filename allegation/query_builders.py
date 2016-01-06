import inspect

from django.db.models.query_utils import Q
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from common.constants import FOIA_START_DATE
from common.models import OUTCOMES, ComplainingWitness, Allegation
from allegation.utils.query import OfficerQuery


NO_DISCIPLINE_CODES = ('600', '000', '500', '700', '800', '900', '')
DISCIPLINE_CODES = [
    x[0] for x in OUTCOMES
    if x[0] not in NO_DISCIPLINE_CODES and x[0] is not None]


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
        queries = self._apply_all_query_methods(query_params)
        return queries

    def _apply_all_query_methods(self, query_params):
        queries = Q()

        for name, func in inspect.getmembers(self, predicate=inspect.ismethod):
            if name[:3] != '_q_':
                continue
            queries &= func(query_params)

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
        adhoc_queries = [
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
            'officer__unit',
            'officer__rank',
            'officer__gender',
            'officer__race',
            'officer__allegations_count__gt',
            'officer__discipline_count__gt',
            'allegation__investigator',
            'cat__category',
            'allegation__city',
        ]

        for key in query_params.keys():
            if key in adhoc_queries:
                val_list = query_params.getlist(key)
                sub_queries = Q()
                for val in val_list:
                    sub_queries |= Q(**{key: val})
                queries &= sub_queries

        return queries

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
        if 'has:document' in query_params.getlist('has_filters', []):
            return Q(allegation__document_id__isnull=False)
        return Q()

    def _q_has_map(self, query_params):
        if 'has:map' in query_params.getlist('has_filters', []):
            return Q(allegation__point__isnull=False)
        return Q()

    def _q_has_address(self, query_params):
        if 'has:address' in query_params.getlist('has_filters', []):
            return Q(allegation__add1__isnull=False) | \
                Q(allegation__add2__isnull=False)
        return Q()

    def _q_has_location(self, query_params):
        if 'has:location' in query_params.getlist('has_filters', []):
            return Q(allegation__location__isnull=False)
        return Q()

    def _q_has_investigator(self, query_params):
        if 'has:investigator' in query_params.getlist('has_filters', []):
            return Q(allegation__investigator__isnull=False)
        return Q()

    def _q_has_identified(self, query_params):
        if 'has:identified' in query_params.getlist('has_filters', []):
            return Q(officer__isnull=False)
        return Q()

    def _q_unsustained_final_finding(self, query_params):
        if 'unsustained' in query_params.getlist('final_finding_text', []):
            return Q(final_finding__in=['DS', 'EX', 'NA', 'NC', 'NS', 'UN'])
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

    def _q_outcome_1_9_days(self, query_params):
        if '1-9 days' in query_params.getlist('outcome_text', []):
            return Q(final_outcome__in=[str(x).zfill(3) for x in range(1, 10)])
        return Q()

    def _q_outcome_10_30_days(self, query_params):
        if '10-30 days' in query_params.getlist('outcome_text', []):
            return Q(final_outcome__in=[
                str(x).zfill(3) for x in range(10, 31)])
        return Q()

    def _q_outcome_30_more_days(self, query_params):
        if '30 more days' in query_params.getlist('outcome_text', []):
            return Q(final_outcome__in=["045", "060", "090", "180", "200"])
        return Q()

    def _query_by_complainant(self, query_params, param_key, query_key):
        if param_key in query_params:
            vals = query_params.getlist(param_key)
            allegation_pks = list(filter(
                None, ComplainingWitness.objects.filter(**{query_key: vals})
                .values_list('allegation__pk', flat=True)))
            return Q(allegation__pk__in=allegation_pks)
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

        return Q(allegation__pk__in=allegation_ids)

    def _q_add_data_source_filter(self, query_params):
        data_source = query_params.getlist('data_source', [])

        if len(data_source) == 2:
            return Q()

        if 'pre-FOIA' in data_source:
            return Q(allegation__incident_date__lt=FOIA_START_DATE)
        elif 'FOIA' in data_source:
            return Q(allegation__incident_date__gte=FOIA_START_DATE)

        return Q()
