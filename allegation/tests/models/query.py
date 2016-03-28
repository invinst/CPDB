from allegation.models.query import NullsLastQuery
from common.tests.core import SimpleTestCase
from common.models import Allegation


class NullsLastQueryTestCase(SimpleTestCase):
    def test_get_compiler_raise_value_error(self):
        query = NullsLastQuery(Allegation)
        query.get_compiler.when.called_with(None, None).should.throw(ValueError)
