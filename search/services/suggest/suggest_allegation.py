import re

from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase
from search.utils.zip_code import get_zipcode_from_city
from search.utils.list import flatten_list, remove_duplicates


class SuggestAllegationCity(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isdigit()

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegation_distinct_city=term).values_list('allegation_distinct_city', flat=True)[:5]

        results = [
            cls.entry_format(
                label=get_zipcode_from_city(entry),
                value=entry,
                filter=cls.build_filter(category='allegation__city', value=entry)
            ) for entry in raw_results
        ]

        return {'Zip Code': results}


class SuggestAllegationCrid(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isnumeric() and len(term) > 3

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegation_crid=term).order_by('allegation_crid_sort').values_list('allegation_crid', flat=True)[:5]
        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='allegation__crid', value=entry)
            ) for entry in raw_results
        ]

        return {'Allegation ID': results}


class SuggestAllegationSummary(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('keyword:') and len(term) > 9

    @classmethod
    def find_suggestion(cls, term, summary):
        pattern = '(?=(^| )(?P<term>(?P<word>{term}\w*)( \w+)?))'.format(term=term)
        matched = [m.groupdict() for m in re.finditer(pattern=pattern, string=summary, flags=re.IGNORECASE)]
        suggestion_entries = [(m['word'].lower(), m['term'].lower()) for m in matched]

        results = flatten_list(suggestion_entries)

        return remove_duplicates(results)

    @classmethod
    def process_raw_results(cls, term, raw_results):
        raw_suggestions = [cls.find_suggestion(term, summary) for summary in raw_results]

        suggestions = remove_duplicates(flatten_list(raw_suggestions))

        sorted_suggestions = sorted(suggestions, key=lambda s: (s.count(' '), s))

        return sorted_suggestions

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()

        term = term[8:]
        raw_results = sqs.filter(
            allegation_summary=term
        ).values_list('allegation_summary', flat=True)

        processed_results = cls.process_raw_results(term, raw_results)

        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='allegation_summary', value=entry)
            ) for entry in processed_results[:5]
        ]

        return {'Allegation Summary': results}
