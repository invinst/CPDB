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
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='officer__allegations_count__gt',
                    value=entry[1],
                    display_category='Repeater',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        return {'Repeater': results}
