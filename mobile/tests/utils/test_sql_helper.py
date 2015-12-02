from mock import MagicMock

from common.tests.core import SimpleTestCase
from mobile.utils.sql_helper import SqlHelper


class SqlHelperTest(SimpleTestCase):
    def test_array_as_sql(self):
        items = ['a', 'b', 'c']
        SqlHelper.array_as_sql(items).should.be.equal("'a','b','c'")

    def test_len_of_raw_queryset(self):
        raw_queryset = MagicMock()
        raw_queryset.__iter__.return_value = [1, 2]
        SqlHelper.len_of_raw_queryset(raw_queryset).should.be(2)
