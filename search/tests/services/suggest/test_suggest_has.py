from allegation.factories import InvestigatorFactory
from common.tests.core import SimpleTestCase
from search.services.suggest.suggest_has import SuggestHas


class SuggestHasTestCase(SimpleTestCase):
    def test_suggest_has_filters(self):
        suggest_entries = SuggestHas.query('has:')['has:']
        suggest_values = [x['suggest_value'] for x in suggest_entries]

        for filter_value in [
                'has:map',
                'has:location',
                'has:address',
                'has:document',
                'has:summary',
                'has:identified',
                'has:investigator']:
            suggest_values.should.contain(filter_value)

    def test_suggest_specific_has_filter(self):
        suggest_entries = SuggestHas.query('has:doc')['has:']
        suggest_values = [x['suggest_value'] for x in suggest_entries]

        len(suggest_entries).should.equal(1)
        suggest_values.should.contain('has:document')
