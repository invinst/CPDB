from mock import patch

from common.tests.core import SimpleTestCase
from search.services.suggest import SuggestBase


class SuggestBaseTestCase(SimpleTestCase):
    def test_call_query_base_on_active_condition(self):
        query_term = 'query_term'

        # Call _query if active_condition returns True
        with patch.object(SuggestBase, '_query') as mock_query_method:
            mock_suggest_base = SuggestBase()
            mock_suggest_base.query(query_term)
            mock_query_method.assert_called_once_with(query_term)

        # Not call _query if active_condition returns False
        with patch.object(SuggestBase, '_query') as mock_query_method:
            with patch.object(SuggestBase, 'active_condition', return_value=False):
                mock_suggest_base = SuggestBase()
                mock_suggest_base.query(query_term)

                mock_query_method.called.should.be.falsy

    def test_suggest_in(self):
        test_data = [['001', 'Magic'], ['002', 'Mock']]

        suggest_base = SuggestBase()
        result = suggest_base.suggest_in('Mo', test_data)

        len(result).should.equal(1)
        result[0][0].should.equal('Mock')

    def test_suggest_in_custom(self):
        test_data = {
            'magic': {
                'text': 'Magic',
            },
            'mock': {
                'text': 'Mock',
            }
        }

        suggest_base = SuggestBase()
        result = suggest_base.suggest_in_custom('Mo', test_data)

        len(result).should.equal(1)
        result[0][0].should.equal('Mock')

    def test_build_tag_filter_value(self):
        suggest_base = SuggestBase()

        result_1 = suggest_base.build_tag_value('', None, '', '')
        result_1['value'].should.equal('null')

        value = 'value'
        result_2 = suggest_base.build_tag_value('', value, '', '')
        result_2['value'].should.equal(value)
