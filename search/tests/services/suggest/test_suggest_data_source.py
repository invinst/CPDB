from search.services.suggest.suggest_data_source import SuggestDataSource
from search.tests.services.suggest.base_test_suggest import BaseSuggestTestCase


class SuggestDataSourceTestCase(BaseSuggestTestCase):
    def test_suggest_area(self):
        results = SuggestDataSource.query('pre')['Data Source']
        results.should.have.length_of(2)
        for result in results:
            result['suggest_value'].should.be.within(['pre-FOIA', 'FOIA'])

    def test_active_condition(self):
        SuggestDataSource.query('pr').should.be.none
