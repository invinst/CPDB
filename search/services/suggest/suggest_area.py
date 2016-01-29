from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


AREA_SORT_ORDERS = {'police-beats': 0, 'neighborhoods': 1, 'ward': 2, 'police-districts': 3, 'school-grounds': 5}


class SuggestArea(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(area_name=term).values_list('area_name', 'area_id', 'area_type')[:20]
        results = sorted(raw_results, key=lambda x: AREA_SORT_ORDERS.get(x[2], 4))

        results = [
            cls.entry_format(
                suggest_value=cls.display_area(entry[2], entry[0]),
                tag_value=cls.build_tag_value(
                    category='allegation__areas__id',
                    value=entry[1],
                    display_category='Area',
                    display_value=cls.display_area(entry[2], entry[0]),
                )
            ) for entry in raw_results
        ]

        return {'Area': results}

    @classmethod
    def display_area(cls, type, id):
        return '{type}: {id}'.format(type=type, id=id)
