from common.models import FINDINGS
from search.services.suggest import SuggestBase


class SuggestFinding(SuggestBase):
    @classmethod
    def _query(cls, term):
        results = cls.suggest_id(term, FINDINGS)

        return {
            'final_finding': results,
            'recc_finding': results
        }
