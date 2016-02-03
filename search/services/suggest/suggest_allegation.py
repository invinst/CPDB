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
        raw_results = sqs.filter(allegation_distinct_city=term).values_list('allegation_distinct_city', flat=True)[:5]

        results = [
            cls.entry_format(
                label=get_zipcode_from_city(entry),
                value=entry,
                filter=cls.build_filter(category='allegation__city', value=entry)
            ) for entry in raw_results
        ]

        return {'Zip Code': results}


class SuggestAllegationCrid(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isnumeric() and len(term) > 3

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegation_crid=term).order_by('allegation_crid_sort')\
            .values_list('allegation_crid', flat=True)[:5]
        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='allegation__crid', value=entry)
            ) for entry in raw_results
        ]

        return {'Allegation ID': results}
