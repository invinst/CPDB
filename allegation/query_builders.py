from django.db.models.query_utils import Q

from common.constants import FOIA_START_DATE
from common.models import OUTCOMES


NO_DISCIPLINE_CODES = ('600', '000', '500', '700', '800', '900', '', None)
DISCIPLINE_CODES = [x[0] for x in OUTCOMES if x[0] not in NO_DISCIPLINE_CODES]


class AlegationQueryBuilder(object):
    """
    Build Q queries from query params.

    Expose a single method: `build`
    """

    query_methods = [
        '_q_adhoc_queries',
        '_q_incident_date_only',
        '_q_add_data_source_filter',
        '_q_has_map',
        '_q_has_document',
        '_q_has_address',
        '_q_has_location',
        '_q_has_investigator'
    ]

    def build(self, query_params):
        """Take `query_params` and return a single Q object."""
        queries = Q()

        for func in self.query_methods:
            func = getattr(self, func)
            queries &= func(query_params)

        return queries

    def _q_adhoc_queries(self, query_params):
        queries = Q()
        adhoc_queries = [
            'id',
            'crid',
            'areas__id',
            'cat',
            'neighborhood_id',
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
            'investigator',
            'cat__category',
            'city',
        ]

        for key, val in query_params.items():
            if key in adhoc_queries:
                queries &= Q(**{key: val})

        return queries

    def _q_has_document(self, query_params):
        if 'has:document' in query_params.getlist('has_filters', []):
            return Q(document_id__isnull=False)
        return Q()

    def _q_has_map(self, query_params):
        if 'has:map' in query_params.getlist('has_filters', []):
            return Q(point__isnull=False)
        return Q()

    def _q_has_address(self, query_params):
        if 'has:address' in query_params.getlist('has_filters', []):
            return Q(add1__isnull=False) | Q(add2__isnull=False)
        return Q()

    def _q_has_location(self, query_params):
        if 'has:location' in query_params.getlist('has_filters', []):
            return Q(location__isnull=False)
        return Q()

    def _q_has_investigator(self, query_params):
        if 'has:investigator' in query_params.getlist('has_filters', []):
            return Q(investigator__isnull=False)
        return Q()

    def _q_unsustained_final_finding(self, query_params):
        if 'unsustained' in query_params.getlist('final_finding_text', []):
            return Q(final_finding__in=['DS', 'EX', 'NA', 'NC', 'NS', 'UN'])
        return Q()

    def _q_outcome_any_discipline(self, query_params):
        if 'any discipline' in query_params.getlist('outcome_text', []):
            return Q(final_finding='SU', final_outcome=DISCIPLINE_CODES)
        return Q()

    def _q_outcome_no_discipline(self, query_params):
        if 'no discipline' in query_params.getlist('outcome_text', []):
            return Q(final_finding='SU', final_outcome=NO_DISCIPLINE_CODES)
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
            return Q(final_outcome=["045", "060", "090", "180", "200"])
        return Q()

    def _q_incident_date_only(self, query_params):
        queries = Q()

        for date_range in query_params.getlist('incident_date_only__range'):
            date_range = date_range.split(',')
            queries |= Q(incident_date_only__range=date_range)

        for year in query_params.getlist('incident_date_only__year'):
            queries |= Q(incident_date_only__year=year)

        for year_month in \
                query_params.getlist('incident_date_only__year_month'):
            year, month = year_month.split('-')
            queries |= Q(
                Q(incident_date_onlys__year=year) &
                Q(incident_date_only__month=month))

        dates = [
            date.replace('/', '-')
            for date in query_params.getlist('incident_date_only')]
        if dates:
            queries |= Q(incident_date_only__in=dates)

        return queries

    def _q_add_data_source_filter(self, query_params):
        data_source = query_params.getlist('data_source', [])

        if len(data_source) == 2:
            return Q()

        if 'pre-FOIA' in data_source:
            return Q(incident_date__lt=FOIA_START_DATE)
        elif 'FOIA' in data_source:
            return Q(incident_date__gte=FOIA_START_DATE)

        return Q()
