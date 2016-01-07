from common.models import GENDER, RACES
from search.services.suggest import SuggestBase


class SuggestRaceGender(SuggestBase):
    @classmethod
    def _query(cls, term):
        gender_results = cls.suggest_in(term, GENDER)
        race_results = cls.suggest_in(term, RACES)

        return {
            'complainant_gender': gender_results,
            'complainant_race': race_results,
            'officer__gender': gender_results,
            'officer__race': race_results
        }
