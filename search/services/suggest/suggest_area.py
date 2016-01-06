from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


AREA_SORT_ORDERS = { 'police-beats': 0, 'neighborhoods': 1, 'ward': 2, 'police-districts': 3, 'school-grounds': 5 }

class SuggestArea(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        results = sqs.filter(area_name=term).values_list('area_name','area_id','area_type')[:20]
        results = sorted(results, key=lambda x: AREA_SORT_ORDERS.get(x[2], 4))

        return { 'allegation__areas__id': results }
