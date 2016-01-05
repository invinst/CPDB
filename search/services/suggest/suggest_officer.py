from haystack.query import SearchQuerySet

from common.models import RANKS, UNITS
from search.services.suggest import SuggestBase


class SuggestOfficerName(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(officer_name=term).order_by('-officer_allegations_count', 'officer_name')[:20]
        results = [("%s (%s)" % (x.officer_name, x.officer_allegations_count), x.officer_id ) for x in raw_results]

        return { 'officer': results }


class SuggestOfficerStar(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isnumeric()

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(officer_star=term).order_by('officer_star_sort').values_list('officer_star', flat=True)[:5]

        return { 'officer__star': results }


class SuggestOfficerUnit(SuggestBase):
    @classmethod
    def _query(cls, term):
        if term.isdigit():
            matches = filter(lambda x: x[0].startswith(term), UNITS)

            results = [[match[1], match[0]] for match in matches]
        else:
            results = cls.suggest_in(term, UNITS)

        return { 'officer__unit': results }


class SuggestOfficerRank(SuggestBase):
    @classmethod
    def _query(cls, term):
        results = cls.suggest_in(term, RANKS)

        return { 'officer__rank': results }
