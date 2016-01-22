from allegation.factories import AllegationFactory
from search.services.suggest.suggest_allegation import SuggestAllegationSummary
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestAllegationTestCase(SuggestBaseTestCase):
    def test_suggest_allegation_summary(self):
        summary_1 = 'some some really long summary I am sorry'

        AllegationFactory(summary=summary_1)

        self.rebuild_index()

        search_term = 'so'
        expected_terms = ['some', 'sorry', 'some really', 'some some']

        results = SuggestAllegationSummary.query('keyword:'+search_term)['Allegation Summary']
        suggested_terms = [x['value'] for x in results]

        suggested_terms.should.equal(expected_terms)

    def test_suggest_allegation_summary_multiple_word_term(self):
        summary_1 = 'some some really long summary I am sorry'

        AllegationFactory(summary=summary_1)

        self.rebuild_index()

        search_term = 'some some'
        expected_terms = ['some some', 'some some really']

        results = SuggestAllegationSummary.query('keyword:'+search_term)['Allegation Summary']
        suggested_terms = [x['value'] for x in results]

        suggested_terms.should.equal(expected_terms)

    def test_suggest_allegation_summary_max_5(self):
        summary_1 = 'some some really long summary I am sorry some else some elves some elks'

        AllegationFactory(summary=summary_1)

        self.rebuild_index()

        search_term = 'so'
        expected_terms = ['some', 'sorry', 'some some', 'some really']

        results = SuggestAllegationSummary.query('keyword:'+search_term)['Allegation Summary']
        suggested_terms = [x['value'] for x in results]
        len(suggested_terms).should.equal(5)

    def test_suggest_allegation_summary_distinct(self):
        summary_1 = 'some some really long summary I am sorry'
        summary_2 = 'some some really long summary I am sorry'

        AllegationFactory(summary=summary_1)
        AllegationFactory(summary=summary_2)

        self.rebuild_index()

        search_term = 'so'

        results = SuggestAllegationSummary.query('keyword:'+search_term)['Allegation Summary']
        suggested_terms = [x['value'] for x in results]
        len(suggested_terms).should.equal(4)
