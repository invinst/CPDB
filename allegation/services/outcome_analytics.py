from django.db.models import Q

FILTERS = {
    'Other': ['NC', 'NA', 'DS', 'ZZ'],
    'Unfounded': ['UN'],
    'Exonerated': ['EX'],
    'Sustained': ['SU'],
    'Not Sustained': ['NS']
}


class OutcomeAnalytics(object):
    @classmethod
    def get_analytics(cls, allegations):
        results = {}
        # TODO: Fixing logic somewhere related to `Other`
        for filter_type in FILTERS:
            if filter_type is not 'Other':
                results[filter_type] = allegations.filter(final_finding__in=FILTERS[filter_type]).count()
        results['Other'] = allegations.filter(Q(final_finding__in=FILTERS['Other']) | Q(final_finding=None)).count()
        results['All'] = allegations.count()
        results['Disciplined'] = allegations.filter(final_outcome_class='disciplined').count()

        return results
