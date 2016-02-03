from haystack.query import SearchQuerySet

from common.constants import RANKS, UNITS, ACTIVE_CHOICES
from search.services.suggest import SuggestBase


class SuggestOfficerName(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(officer_name=term).order_by('-officer_allegations_count', 'officer_name')[:20]

        results = [
            cls.entry_format(
                suggest_value='{name} ({count})'.format(name=entry.officer_name, count=entry.officer_allegations_count),
                tag_value=cls.build_tag_value(
                    category='officer',
                    value=entry.officer_id,
                    display_category='Officer',
                    display_value=entry.officer_name,
                )
            ) for entry in raw_results
        ]

        return {'Officer': results}


class SuggestOfficerStar(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isnumeric()

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(officer_star=term).order_by('officer_star_sort')\
            .values_list('officer_star', flat=True)[:5]

        results = [
            cls.entry_format(
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category='officer__star',
                    value=entry,
                    display_category='Badge number',
                    display_value=entry,
                )
            ) for entry in raw_results
        ]

        return {'Badge number': results}


class SuggestOfficerUnit(SuggestBase):
    @classmethod
    def _query(cls, term):
        if term.isdigit():
            matches = filter(lambda x: x[0].startswith(term), UNITS)

            raw_results = [[match[1], match[0]] for match in matches]
        else:
            raw_results = cls.suggest_in(term, UNITS)

        results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='officer__unit',
                    value=entry[1],
                    display_category='Officer Unit',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        return {'Officer Unit': results}


class SuggestOfficerActive(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, ACTIVE_CHOICES)

        results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='officer__active',
                    value=entry[1],
                    display_category='Officer Employment Status',
                    display_value=entry[0]
                ),
            ) for entry in raw_results
        ]

        return {'Officer Employment Status': results}


class SuggestOfficerRank(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, RANKS)

        results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='officer__rank',
                    value=entry[1],
                    display_category='Officer Rank',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        return {'Officer Rank': results}
