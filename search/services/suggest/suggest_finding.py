from common.constants import FINDINGS
from search.services.suggest import SuggestBase


class SuggestFinding(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, FINDINGS)

        final_finding_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='final_finding', value=entry[1])
            ) for entry in raw_results
        ]

        recc_finding_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='recc_finding', value=entry[1])
            ) for entry in raw_results
        ]

        return {
            'Final Finding': final_finding_results,
            'Recommended Finding': recc_finding_results
        }
