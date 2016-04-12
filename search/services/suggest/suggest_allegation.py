import re

from haystack.query import SearchQuerySet

from search.services.suggest import SuggestBase


class SuggestAllegationCity(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.isdigit()

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegation_distinct_zip_code=term)[:5]

        results = [
            cls.entry_format(
                suggest_value=entry.allegation_distinct_zip_code,
                tag_value=cls.build_tag_value(
                    category='allegation__city',
                    value=entry.allegation_distinct_city,
                    display_category='Zip Code',
                    display_value=entry.allegation_distinct_city
                )
            ) for entry in raw_results
        ]

        return {'Zip Code': results}


class SuggestAllegationCrid(SuggestBase):
    @classmethod
    def get_crid_from_term(cls, term):
        matched = re.search('\d+', term)
        if matched:
            return matched.group(0)
        return

    @classmethod
    def active_condition(cls, term):
        if term.lower().startswith('cr'):
            crid = cls.get_crid_from_term(term)
            return crid and len(crid) > 3
        else:
            return term.isnumeric() and len(term) > 3

    @classmethod
    def _query(cls, term):
        search_term = cls.get_crid_from_term(term)

        sqs = SearchQuerySet()
        raw_results = sqs.filter(allegation_crid=search_term).order_by('allegation_crid_sort')\
            .values_list('allegation_crid', flat=True)[:5]
        results = [
            cls.entry_format(
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category='allegation__crid',
                    value=entry,
                    display_category='Allegation ID',
                    display_value=entry
                ),
            ) for entry in raw_results
        ]

        return {'Allegation ID': results}


class SuggestAllegationSummary(SuggestBase):
    @classmethod
    def find_suggestion(cls, term, summary):
        pattern = '(?=(^| )(?P<term>(?P<word>{term}\w*)( \w+)?))'.format(term=term)
        matched = [m.groupdict() for m in re.finditer(pattern=pattern, string=summary, flags=re.IGNORECASE)]

        suggestion_entries = set()
        for m in matched:
            suggestion_entries.add(m['word'].lower())
            suggestion_entries.add(m['term'].lower())

        return list(suggestion_entries)

    @classmethod
    def process_raw_results(cls, term, raw_results):
        suggestions = set()
        for summary in raw_results:
            suggestions.update(cls.find_suggestion(term, summary))

        suggestions = list(suggestions)
        sorted_suggestions = sorted(suggestions, key=lambda s: (s.count(' '), s))

        return sorted_suggestions

    @classmethod
    def _query(cls, term):
        sqs = SearchQuerySet()

        raw_results = sqs.filter(
            allegation_summary=term
        ).values_list('allegation_summary', flat=True)

        processed_results = cls.process_raw_results(term, raw_results)

        results = [
            cls.entry_format(
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category='allegation_summary',
                    value=entry,
                    display_category='Allegation Summary',
                    display_value=entry
                ),
            ) for entry in processed_results[:5]
        ]

        return {'Allegation Summary': results}
