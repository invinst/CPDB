from common.models import FINDINGS
from search.services.suggest import SuggestBase


class SuggestFinding(SuggestBase):
    @classmethod
    def _query(cls, term):
        results = cls.suggest_in(term, FINDINGS)

        return {
            'final_finding': results,
            'recc_finding': results
        }
