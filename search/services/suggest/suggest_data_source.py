from search.services.suggest import SuggestBase


class SuggestDataSource(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('pre') or term.startswith('foi')

    @classmethod
    def _query(cls, term):
        return { 'data_source': ['FOIA', 'pre-FOIA'] }
