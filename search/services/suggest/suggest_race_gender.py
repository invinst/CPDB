from common.constants import GENDER, RACES
from search.services.suggest import SuggestBase


class SuggestRaceGender(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_gender_results = cls.suggest_in(term, GENDER)
        raw_race_results = cls.suggest_in(term, RACES)

        complainant_gender_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='complainant_gender',
                    value=entry[1],
                    display_category='Complainant Gender',
                    display_value=entry[0],
                )
            ) for entry in raw_gender_results
        ]

        officer_gender_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='officer__gender',
                    value=entry[1],
                    display_category='Officer Gender',
                    display_value=entry[0],
                )
            ) for entry in raw_gender_results
        ]

        complainant_race_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='complainant_race',
                    value=entry[1],
                    display_category='Complainant Race',
                    display_value=entry[0],
                )
            ) for entry in raw_race_results
        ]

        officer_race_results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='officer__race',
                    value=entry[1],
                    display_category='Officer Race',
                    display_value=entry[0],
                )
            ) for entry in raw_race_results
        ]

        return {
            'Complainant Gender': complainant_gender_results,
            'Complainant Race': complainant_race_results,
            'Officer Gender': officer_gender_results,
            'Officer Race': officer_race_results
        }
