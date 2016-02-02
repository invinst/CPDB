from common.tests.core import SimpleTestCase
from search.services.suggest.suggest_has import SuggestHas


class SuggestHasTestCase(SimpleTestCase):
    def test_suggest_has_filters(self):
        suggest_entries = SuggestHas.query('has')['has:']

        len(suggest_entries).should.equal(7)
        entry_values = [entry['value'] for entry in suggest_entries]

        for filter_value in [
                'has:map',
                'has:location',
                'has:address',
                'has:document',
                'has:summary',
                'has:identified',
                'has:investigator']:
            entry_values.should.contain(filter_value)

    def test_suggest_specific_has_filter(self):
        suggest_entries = SuggestHas.query('has:doc')['has:']

        len(suggest_entries).should.equal(1)
        suggest_entries[0]['value'].should.equal('has:document')
