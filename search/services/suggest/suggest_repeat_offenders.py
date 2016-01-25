from search.services import REPEATER_DESC
from search.services.suggest import SuggestBase


class SuggestRepeatOffenders(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('rep')

    @classmethod
    def _query(cls, term):
        raw_results = [[value, int(key)] for key, value in REPEATER_DESC.items()]

        results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='officer__allegations_count__gt', value=entry[1])
            ) for entry in raw_results
        ]

        return {'Repeater': results}
