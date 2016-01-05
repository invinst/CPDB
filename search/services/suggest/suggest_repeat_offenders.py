from search.services import REPEATER_DESC
from search.services.suggest import SuggestBase


class SuggestRepeatOffenders(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('rep')

    @classmethod
    def _query(cls, term):
        results = [[value, int(key)] for key, value in REPEATER_DESC.items()]

        return { 'officer__allegations_count__gt': results }
