from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


class SuggestInvestigator(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(investigator_name=term).order_by('-investigator_complaint_count')[:5]
        results = [("%s (%s)" % (x.investigator_name, x.investigator_complaint_count), x.investigator_id) for x in raw_results]

        return { 'investigator': results }
