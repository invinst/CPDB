from common.models import HAS_FILTERS_LIST
from search.services.suggest import SuggestBase


class SuggestHas(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('has')

    @classmethod
    def _query(cls, term):
        results = []

        for val, filter_text in HAS_FILTERS_LIST:
            if filter_text[:len(term)] == term:
                results.append([filter_text, val])

        return { 'has_filters': results }
