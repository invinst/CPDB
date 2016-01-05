from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


class SuggestAllegationCategoryCatId(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegationcategory_name_and_id=term).values_list('allegationcategory_cat_id', flat=True).order_by('-allegationcategory_allegation_count')[:5]

        return { 'cat__cat_id': results }


class SuggestAllegationCategoryCategory(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegationcategory_category=term).values_list('allegationcategory_category', flat=True).order_by('-allegationcategory_category_count')[:5]

        return { 'cat__category': results }


class SuggestAllegationCategoryNameId(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegationcategory_name_and_id=term).values_list('allegationcategory_allegation_name','allegationcategory_id').order_by('-allegationcategory_allegation_count')[:5]

        return { 'cat': results }
