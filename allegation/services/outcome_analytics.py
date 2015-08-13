FILTERS = {
    'Other': ['NC', 'NA', 'DS'],
    'Unfounded': ['UN'],
    'Exonerated': ['EX'],
    'Sustained': ['SU'],
    'Not Sustained': ['NS']
}


class OutcomeAnalytics(object):
    @classmethod
    def get_analytics(cls, allegations):
        results = {}

        for filter_type in FILTERS:
            results[filter_type] = allegations.filter(final_finding__in=FILTERS[filter_type]).count()

        results['All'] = allegations.count()
        results['Disciplined'] = allegations.filter(final_outcome_class='disciplined').count()

        return results
