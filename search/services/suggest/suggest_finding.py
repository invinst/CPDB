from common.constants import FINDINGS
from search.services.suggest import SuggestBase


class SuggestFinding(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, FINDINGS)

        final_finding_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='final_finding',
                    value=entry[1],
                    display_category='Final Finding',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        recc_finding_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='recc_finding',
                    value=entry[1],
                    display_category='Recommended Finding',
                    display_value=entry[0]
                )
            ) for entry in raw_results
        ]

        return {
            'Final Finding': final_finding_results,
            'Recommended Finding': recc_finding_results
        }
