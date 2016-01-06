from allegation.factories import InvestigatorFactory
from common.tests.core import SimpleTestCase
from search.services.suggest.suggest_has import SuggestHas


class SuggestHasTestCase(SimpleTestCase):
    def test_suggest_has_filters(self):
        data = SuggestHas.query('has')

        data.should.contain('has_filters')
        len(data['has_filters']).should.equal(7)
        for filter_name, filter_value in [
                ('has:map', 'has:map'),
                ('has:location', 'has:location'),
                ('has:address', 'has:address'),
                ('has:document', 'has:document'),
                ('has:summary', 'has:summary'),
                ('has:identified', 'has:identified'),
                ('has:investigator', 'has:investigator')]:
            data['has_filters'].should.contain([filter_name, filter_value])

    def test_suggest_specific_has_filter(self):
        data = SuggestHas.query('has:doc')

        data.should.contain('has_filters')
        len(data['has_filters']).should.equal(1)
        data['has_filters'][0][0].should.equal('has:document')
        data['has_filters'][0][1].should.equal('has:document')

