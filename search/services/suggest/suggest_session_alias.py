from haystack.query import SearchQuerySet

from common.utils.hashid import hash_obj
from search.services.suggest import SuggestBase


class SuggestSessionAlias(SuggestBase):
    @classmethod
    def _query(cls, term):
        # This suggest doesn't create a filter, it's for navigation purpose only
        sqs = SearchQuerySet()
        raw_results = sqs.filter(sessionalias_alias=term)[:5]

        results = [
            cls.entry_format(
                label=entry.sessionalias_title,
                value=hash_obj.encode(entry.sessionalias_session_id),
                filter=cls.build_filter(category='session', value=entry.sessionalias_session_id)
            ) for entry in raw_results
        ]

        return {'Session': results}
