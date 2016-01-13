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
                results.append(val)

        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='has_filters', value=entry)
            ) for entry in results
        ]

        return {'has:': results}
