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
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category='data_source',
                    value=entry,
                    display_category='Data Source',
                    display_value=entry,
                )
            ) for entry in raw_results
        ]

        return {'Data Source': results}
