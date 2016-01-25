from common.models import GENDER, RACES
from search.services.suggest import SuggestBase


class SuggestRaceGender(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_gender_results = cls.suggest_in(term, GENDER)
        raw_race_results = cls.suggest_in(term, RACES)

        complainant_gender_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='complainant_gender', value=entry[1])
            ) for entry in raw_gender_results
        ]

        officer_gender_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='officer__gender', value=entry[1])
            ) for entry in raw_gender_results
        ]

        complainant_race_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='complainant_race', value=entry[1])
            ) for entry in raw_race_results
        ]

        officer_race_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='officer__race', value=entry[1])
            ) for entry in raw_race_results
        ]

        return {
            'Complainant Gender': complainant_gender_results,
            'Complainant Race': complainant_race_results,
            'Officer Gender': officer_gender_results,
            'Officer Race': officer_race_results
        }
