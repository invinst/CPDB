from haystack.query import SearchQuerySet

from common.utils.hashid import hash_obj
from search.services.suggest import SuggestBase


class SuggestSessionAlias(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(sessionalias_alias=term)[:5]
        results = [(x.sessionalias_title, hash_obj.encode(x.sessionalias_session_id)) for x in raw_results]

        return { 'session': results }
