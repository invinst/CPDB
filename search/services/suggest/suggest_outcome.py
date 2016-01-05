from common.models import OUTCOMES, OUTCOME_TEXT_DICT
from search.services.suggest import SuggestBase


class SuggestOutcome(SuggestBase):
    @classmethod
    def _query(cls, term):
        results = cls.suggest_in(term, OUTCOMES)

        return {
            'final_outcome': results,
            'recc_outcome': results
        }


class SuggestOutcomeText(SuggestBase):
    @classmethod
    def _query(cls, term):
        results = cls.suggest_in_custom(term, OUTCOME_TEXT_DICT)

        return { 'outcome_text': results }
