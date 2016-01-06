from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


class SuggestAllegationCategoryCat(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegationcategory_name_and_id=term).values_list('allegationcategory_cat_id', 'allegationcategory_allegation_name', 'allegationcategory_id').order_by('-allegationcategory_allegation_count')[:5]

        cat_id_results = [x[0] for x in results]
        cat_results = [[x[1], x[2]] for x in results]

        return {
            'cat__cat_id': cat_id_results,
            'cat': cat_results
        }


class SuggestAllegationCategoryCategory(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(allegationcategory_category=term).values_list('allegationcategory_category', flat=True).order_by('-allegationcategory_category_count')[:5]

        return { 'cat__category': results }
