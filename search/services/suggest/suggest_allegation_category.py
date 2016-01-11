from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


class SuggestAllegationCategoryCat(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegationcategory_name_and_id=term)\
            .values_list('allegationcategory_cat_id', 'allegationcategory_allegation_name', 'allegationcategory_id')\
            .order_by('-allegationcategory_allegation_count')[:5]

        cat_id_results = [
            cls.entry_format(
                label=entry[0],
                value=entry[0],
                filter=cls.build_filter(category='cat__cat_id', value=entry[0])
            ) for entry in raw_results]

        cat_results = [
            cls.entry_format(
                label=entry[1],
                value=entry[1],
                filter=cls.build_filter(category='cat', value=entry[2])
            ) for entry in raw_results
        ]

        return {
            'Category ID': cat_id_results,
            'Allegation type': cat_results
        }


class SuggestAllegationCategoryCategory(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegationcategory_category=term)\
            .values_list('allegationcategory_category', flat=True)\
            .order_by('-allegationcategory_category_count')[:5]

        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='cat__category', value=entry)
            ) for entry in raw_results
        ]

        return {'Category': results}
