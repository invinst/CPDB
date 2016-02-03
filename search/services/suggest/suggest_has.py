from common.constants import HAS_FILTERS_LIST
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
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category=entry.replace(':', '_'),
                    value=True,
                    display_category='has:',
                    display_value=entry,
                )
            ) for entry in results
        ]

        return {'has:': results}
