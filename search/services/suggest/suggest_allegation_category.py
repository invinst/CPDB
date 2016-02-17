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
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='cat__cat_id',
                    value=entry[0],
                    display_category='Category ID',
                    display_value=entry[0],
                )
            ) for entry in raw_results
        ]

        cat_results = [
            cls.entry_format(
                suggest_value=entry[1],
                tag_value=cls.build_tag_value(
                    category='cat',
                    value=entry[2],
                    display_category='Allegation type',
                    display_value=entry[1],
                )
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
        raw_results = sqs.filter(allegationcategory_distinct_category=term)\
            .values_list('allegationcategory_distinct_category', flat=True)\
            .order_by('-allegationcategory_distinct_category_count')[:5]

        results = [
            cls.entry_format(
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category='cat__category',
                    value=entry,
                    display_category='Category',
                    display_value=entry,
                )
            ) for entry in raw_results
        ]

        return {'Category': results}


class SuggestAllegationCategoryOnDuty(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = cls.suggest_in(term, [[True, 'On Duty'], [False, 'Off Duty']])

        results = [
            cls.entry_format(
                suggest_value=entry[0],
                tag_value=cls.build_tag_value(
                    category='cat__on_duty',
                    value=entry[1],
                    display_category='Category On Duty',
                    display_value=entry[0]
                ),
            ) for entry in raw_results
        ]
        return {'Category On Duty': results}
