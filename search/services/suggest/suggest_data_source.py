from search.services.suggest import SuggestBase


class SuggestDataSource(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('pre') or term.startswith('foi')

    @classmethod
    def _query(cls, term):
        raw_results = ['FOIA', 'pre-FOIA']

        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='data_source', value=entry)
            ) for entry in raw_results
        ]

        return {'Data Source': results}
