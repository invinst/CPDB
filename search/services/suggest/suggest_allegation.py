from django.db.models import Q
from haystack.query import SearchQuerySet

from common.models import Allegation
from search.services.suggest import SuggestBase
from search.utils.zip_code import get_zipcode_from_city


class SuggestAllegationCity(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isdigit()

    @classmethod
    def _query(cls, term):
        raw_results = cls._query_database(
            model_cls = Allegation,
            condition = Q(city__icontains=term),
            fields_to_get = ('city',)
        )
        results = [
            cls.entry_format(
                label=get_zipcode_from_city(x),
                value=x,
                filter=cls.build_filter(category='city', value=x)
            ) for x in raw_results
        ]

        return { 'Zip Code': results }


class SuggestAllegationCrid(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isnumeric() and len(term) > 3

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegation_crid=term).order_by('allegation_crid_sort').values_list('allegation_crid', flat=True)[:5]

        return { 'allegation__crid': results }
