from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase
from search.utils.zip_code import get_zipcode_from_city


class SuggestAllegationCity(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isdigit()

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegation_city=term).values_list('allegation_city', flat=True)
        distinct_results = list(set(raw_results))
        results = [(get_zipcode_from_city(x), x) for x in distinct_results][:5]

        return { 'city': results }


class SuggestAllegationCrid(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isnumeric() and len(term) > 3

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegation_crid=term).order_by('allegation_crid_sort').values_list('allegation_crid', flat=True)[:5]

        return { 'crid': results }
