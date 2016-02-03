from common.constants import OUTCOMES, OUTCOME_TEXT_DICT
from search.services.suggest import SuggestBase


class SuggestOutcome(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, OUTCOMES)

        final_outcome_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='final_outcome',
                    value=entry[1],
                    display_category='Final Outcome',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        recc_outcome_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='recc_outcome',
                    value=entry[1],
                    display_category='Recommended Outcome',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        return {
            'Final Outcome': final_outcome_results,
            'Recommended Outcome': recc_outcome_results
        }


class SuggestOutcomeText(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in_custom(term, OUTCOME_TEXT_DICT)

        results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='outcome_text',
                    value=entry[1],
                    display_category='Outcome',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        return {'Outcome': results}
