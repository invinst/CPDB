from django.db.models import Case, Value, When, CharField

from allegation.models.utils import get_num_range_case
from common.tests.core import SimpleTestCase


class ModelUtilsTestCase(SimpleTestCase):
    def test_get_num_range_case(self):
        num_range = [1, 5]
        expect_result = Case(
            When(a__gte=1, a__lte=5, then=Value('1-5')),
            When(a__gte=6, then=Value('6+')),
            default=Value('Unknown'),
            output_field=CharField()
            )
        actual_result = get_num_range_case('a', num_range)

        repr(expect_result).should.equal(repr(actual_result))

    def test_get_num_range_case_single_value(self):
        num_range = [1]
        expect_result = Case(
            When(a__gte=1, then=Value('1+')),
            default=Value('Unknown'),
            output_field=CharField()
            )
        actual_result = get_num_range_case('a', num_range)

        repr(expect_result).should.equal(repr(actual_result))

    def test_get_num_range_case_empty_array(self):
        num_range = []
        expect_result = Case(
            default=Value('Unknown'),
            output_field=CharField()
            )
        actual_result = get_num_range_case('a', num_range)

        repr(expect_result).should.equal(repr(actual_result))
