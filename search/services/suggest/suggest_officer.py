from haystack.query import SearchQuerySet

from common.models import RANKS, UNITS
from search.services.suggest import SuggestBase


class SuggestOfficerName(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(officer_name=term).order_by('-officer_allegations_count', 'officer_name')[:20]

        results = [
            cls.entry_format(
                label='{name} ({count})'.format(name=entry.officer_name, count=entry.officer_allegations_count),
                value=entry.officer_name,
                filter=cls.build_filter(category='officer', value=entry.officer_id)
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
        raw_results = sqs.filter(officer_star=term).order_by('officer_star_sort').values_list('officer_star', flat=True)[:5]

        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='officer__star', value=entry)
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
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='officer__unit', value=entry[1])
            ) for entry in raw_results
        ]

        return {'Officer Unit': results}


class SuggestOfficerRank(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, RANKS)

        results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='officer__rank', value=entry[1])
            ) for entry in raw_results
        ]

        return {'Officer Rank': results}
