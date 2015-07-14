from allegation.models.query_set_manager import QuerySetManager
from common.tests.core import SimpleTestCase


class QuerySetManagerTestCase(SimpleTestCase):
    def test_raise_exception_if_subclass_get_queryset_is_not_implemented(self):
        queryset_manager = QuerySetManager()
        self.assertRaises(NotImplementedError, queryset_manager.get_queryset)
