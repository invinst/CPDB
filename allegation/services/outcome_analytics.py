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
    def get_analytics(cls, officer_allegations):
        results = {}
        # TODO: Fixing logic somewhere related to `Other`
        for filter_type in FILTERS:
            if filter_type is not 'Other':
                results[filter_type] = officer_allegations.filter(
                    final_finding__in=FILTERS[filter_type]).count()
        results['Other'] = officer_allegations.filter(
            Q(final_finding__in=FILTERS['Other']) |
            Q(final_finding__isnull=True)).count()
        results['All'] = officer_allegations.count()
        results['Disciplined'] = officer_allegations.filter(
            final_outcome_class='disciplined').count()

        return results
