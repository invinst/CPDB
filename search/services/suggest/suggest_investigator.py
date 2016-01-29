from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


class SuggestInvestigator(SuggestBase):
    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(investigator_name=term).order_by('-investigator_complaint_count')[:5]

        results = [
            cls.entry_format(
                suggest_value='{name} ({count})'.format(
                        name=entry.investigator_name, count=entry.investigator_complaint_count),
                tag_value=cls.build_tag_value(
                    category='allegation__investigator',
                    value=entry.investigator_id,
                    display_category='Investigator',
                    display_value=entry.investigator_name,
                )
            ) for entry in raw_results
        ]

        return {'Investigator': results}
